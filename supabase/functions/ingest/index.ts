import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const MAX_BODY_BYTES = 1_000_000;
const MAX_EVENTS = 250;
const MAX_SNAPSHOTS = 100;

type EventType =
  | "join"
  | "leave"
  | "snapshot_full"
  | "snapshot_compact"
  | "purchase"
  | "gift"
  | "sale"
  | "security";

type IngestEvent = {
  event_id: string;
  event_type: EventType;
  schema_version: number;
  occurred_at: string;
  server_job_id?: string;
  place_id?: number;
  payload: Record<string, unknown>;
};

type RpcResult = {
  accepted_event_ids?: string[];
  duplicate_event_ids?: string[];
  rejected?: Array<{ event_id?: string; reason: string }>;
};

const rpcByType: Record<EventType, string> = {
  join: "ingest_player_events",
  leave: "ingest_player_events",
  snapshot_full: "ingest_player_snapshots",
  snapshot_compact: "ingest_player_snapshots",
  purchase: "ingest_purchases",
  gift: "ingest_gifts",
  sale: "ingest_sales",
  security: "ingest_security_events",
};

function json(status: number, body: unknown, requestId: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "x-request-id": requestId,
    },
  });
}

function isUuid(value: unknown) {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function validateEvent(value: unknown): value is IngestEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<IngestEvent>;
  return isUuid(event.event_id) &&
    typeof event.event_type === "string" &&
    event.event_type in rpcByType &&
    Number.isInteger(event.schema_version) &&
    typeof event.occurred_at === "string" &&
    !!event.payload &&
    typeof event.payload === "object";
}

Deno.serve(async (request) => {
  const requestId = crypto.randomUUID();

  if (request.method !== "POST") {
    return json(405, { error: "method_not_allowed", request_id: requestId }, requestId);
  }

  const expectedSecret = Deno.env.get("ROBLOX_API_SECRET");
  const providedSecret = request.headers.get("x-api-key");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return json(401, { error: "unauthorized", request_id: requestId }, requestId);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return json(413, { error: "request_too_large", request_id: requestId }, requestId);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "invalid_json", request_id: requestId }, requestId);
  }

  const events = (body as { events?: unknown }).events;
  if (!Array.isArray(events)) {
    return json(400, { error: "events_must_be_array", request_id: requestId }, requestId);
  }
  if (events.length > MAX_EVENTS) {
    return json(413, { error: "too_many_events", max_events: MAX_EVENTS, request_id: requestId }, requestId);
  }

  const accepted_event_ids: string[] = [];
  const duplicate_event_ids: string[] = [];
  const rejected: Array<{ event_id?: string; reason: string }> = [];
  const groups = new Map<string, IngestEvent[]>();
  let snapshotCount = 0;

  for (const event of events) {
    if (!validateEvent(event)) {
      rejected.push({
        event_id: typeof (event as { event_id?: unknown })?.event_id === "string"
          ? (event as { event_id: string }).event_id
          : undefined,
        reason: "invalid_event_shape",
      });
      continue;
    }

    if (event.event_type === "snapshot_full" || event.event_type === "snapshot_compact") {
      snapshotCount += 1;
    }

    const rpc = rpcByType[event.event_type];
    const group = groups.get(rpc) ?? [];
    group.push(event);
    groups.set(rpc, group);
  }

  if (snapshotCount > MAX_SNAPSHOTS) {
    return json(413, {
      error: "too_many_snapshots",
      max_snapshots: MAX_SNAPSHOTS,
      request_id: requestId,
    }, requestId);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "server_not_configured", request_id: requestId }, requestId);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  for (const [rpc, groupedEvents] of groups) {
    const { data, error } = await supabase.rpc(rpc, { events: groupedEvents });
    if (error) {
      return json(503, {
        error: "database_rpc_failed",
        rpc,
        message: error.message,
        request_id: requestId,
      }, requestId);
    }

    const result = data as RpcResult;
    accepted_event_ids.push(...(result.accepted_event_ids ?? []));
    duplicate_event_ids.push(...(result.duplicate_event_ids ?? []));
    rejected.push(...(result.rejected ?? []));
  }

  return json(200, {
    request_id: requestId,
    accepted_event_ids,
    duplicate_event_ids,
    rejected,
  }, requestId);
});
