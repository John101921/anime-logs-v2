import { createServerSupabaseClient } from "@/lib/supabase";

export type PlayerEventRow = {
  id: number;
  event_type: string;
  player_id: number;
  player_name: string;
  cash: number;
  highest_wave: number;
  total_kills: number;
  created_at: string;
};

export type JsonRecord = Record<string, unknown>;

export type InventoryEntry = {
  character_name?: string;
  character_id?: string;
  level?: number;
  mutation?: string;
  trait?: string;
  position?: string | number;
};

export type ItemEntry = {
  item_name?: string;
  quantity?: number;
};

export type PlayerEventDetail = PlayerEventRow & {
  source_event_id: string;
  joined_at: string | null;
  left_at: string | null;
  session_duration_seconds: number | null;
  occurred_at: string;
  payload: JsonRecord;
  inventory: InventoryEntry[];
  items: ItemEntry[];
  equipped: InventoryEntry[];
};

export type SnapshotRow = {
  id: number;
  snapshot_kind: string;
  player_id: number;
  player_name: string;
  cash: number;
  highest_wave: number;
  total_kills: number;
  created_at: string;
};

export type SnapshotDetail = SnapshotRow & {
  source_event_id: string;
  occurred_at: string;
  payload: JsonRecord;
  inventory: InventoryEntry[];
  items: ItemEntry[];
  equipped: InventoryEntry[];
  changed_fields: JsonRecord;
  state_hash: string | null;
  profile_version: number | null;
};

export type PurchaseRow = {
  id: number;
  player_id: number;
  player_name: string;
  product_name: string;
  robux_spent: number;
  purchase_id: string | null;
  created_at: string;
};

export type GiftRow = {
  id: number;
  source_event_id: string;
  giver_id: number;
  giver_name: string;
  receiver_id: number;
  receiver_name: string;
  character_name: string | null;
  character_id: string | null;
  level: number;
  mutation: string | null;
  trait: string | null;
  occurred_at: string;
  created_at: string;
};

export type SaleCharacter = {
  character_name?: string;
  name?: string;
  character_id?: string;
  id?: string;
  level?: number;
  mutation?: string;
  trait?: string;
  cash_received?: number;
};

export type CharacterSaleRow = {
  id: number;
  source_event_id: string;
  player_id: number;
  player_name: string;
  sale_type: string | null;
  total_cash_received: number;
  total_sold: number;
  characters: SaleCharacter[];
  occurred_at: string;
  created_at: string;
};

export type SecurityRow = {
  id: number;
  category: string;
  severity: string;
  player_id: number | null;
  player_name: string | null;
  created_at: string;
};

export type PlayerInvestigation = {
  playerId: number;
  events: PlayerEventRow[];
  snapshots: SnapshotRow[];
  purchases: PurchaseRow[];
  gifts: GiftRow[];
  sales: CharacterSaleRow[];
  security: SecurityRow[];
};

export type QueryOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  status?: string;
};

export type PagedResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalCountIsExact: boolean;
  hasNextPage: boolean;
};

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function normalizeQueryOptions(options: QueryOptions = {}) {
  return {
    page: Math.max(1, Number(options.page) || 1),
    pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, Number(options.pageSize) || DEFAULT_PAGE_SIZE)),
    search: (options.search ?? "").trim(),
    type: (options.type ?? "").trim(),
    status: (options.status ?? "").trim(),
  };
}

function applyPlayerSearch<T>(query: T, search: string): T {
  if (!search) return query;
  const maybeId = Number(search);
  if (Number.isSafeInteger(maybeId)) {
    return (query as { eq: (column: string, value: number) => T }).eq("player_id", maybeId);
  }
  return (query as { ilike: (column: string, pattern: string) => T }).ilike("player_name", `%${search.replaceAll("%", "\\%")}%`);
}

function applyTextSearch<T>(query: T, search: string, columns: string[]): T {
  if (!search) return query;
  const escaped = search.replaceAll("%", "\\%");
  return (query as { or: (filters: string) => T }).or(columns.map((column) => `${column}.ilike.%${escaped}%`).join(","));
}

function normalizeSale(row: CharacterSaleRow): CharacterSaleRow {
  return {
    ...row,
    characters: asArray<SaleCharacter>(row.characters),
  };
}

function approximateTotalCount(from: number, rowsLength: number, hasNextPage: boolean) {
  return from + rowsLength + (hasNextPage ? 1 : 0);
}

function pagedApproximateResult<T>(loadedRows: T[], page: number, pageSize: number, from: number): PagedResult<T> {
  const rows = loadedRows.slice(0, pageSize);
  const hasNextPage = loadedRows.length > pageSize;
  return {
    rows,
    page,
    pageSize,
    totalCount: approximateTotalCount(from, rows.length, hasNextPage),
    totalCountIsExact: false,
    hasNextPage,
  };
}

export async function getOverviewData() {
  const supabase = createServerSupabaseClient();

  const [events, snapshots, purchases, gifts, sales, security, health] = await Promise.all([
    supabase.from("player_events").select("id, event_type, player_id, player_name, cash, highest_wave, total_kills, created_at").order("created_at", { ascending: false }).limit(12),
    supabase.from("player_snapshots").select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("product_purchases").select("id, player_id, player_name, product_name, robux_spent, purchase_id, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("gift_logs").select("id, source_event_id, giver_id, giver_name, receiver_id, receiver_name, character_name, character_id, level, mutation, trait, occurred_at, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("character_sales").select("id, source_event_id, player_id, player_name, sale_type, total_cash_received, total_sold, characters, occurred_at, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("security_events").select("id, category, severity, player_id, player_name, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("ingest_health_summary").select("*").maybeSingle(),
  ]);

  return {
    events: (events.data ?? []) as PlayerEventRow[],
    snapshots: (snapshots.data ?? []) as SnapshotRow[],
    purchases: (purchases.data ?? []) as PurchaseRow[],
    gifts: (gifts.data ?? []) as GiftRow[],
    sales: ((sales.data ?? []) as CharacterSaleRow[]).map(normalizeSale),
    security: (security.data ?? []) as SecurityRow[],
    health: health.data as {
      player_events_last_hour: number;
      snapshots_last_hour: number;
      purchases_last_hour: number;
      gifts_last_hour?: number;
      sales_last_hour?: number;
      security_events_last_hour: number;
      last_ingested_at: string | null;
    } | null,
  };
}

export async function getGifts(options?: QueryOptions): Promise<PagedResult<GiftRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("gift_logs")
    .select("id, source_event_id, giver_id, giver_name, receiver_id, receiver_name, character_name, character_id, level, mutation, trait, occurred_at, created_at")
    .order("id", { ascending: false })
    .range(from, to);

  if (search) {
    const maybeId = Number(search);
    if (Number.isSafeInteger(maybeId)) {
      query = query.or(`giver_id.eq.${maybeId},receiver_id.eq.${maybeId}`);
    } else {
      query = applyTextSearch(query, search, ["giver_name", "receiver_name", "character_name", "character_id", "mutation", "trait"]);
    }
  }
  if (type === "mutated") query = query.not("mutation", "is", null).neq("mutation", "Normal");
  if (type === "traited") query = query.not("trait", "is", null).neq("trait", "None");

  const { data, error } = await query;
  if (error) throw error;
  return pagedApproximateResult((data ?? []) as GiftRow[], page, pageSize, from);
}

export async function getCharacterSales(options?: QueryOptions): Promise<PagedResult<CharacterSaleRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type, status } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("character_sales")
    .select("id, source_event_id, player_id, player_name, sale_type, total_cash_received, total_sold, characters, occurred_at, created_at")
    .order("id", { ascending: false })
    .range(from, to);

  if (search) {
    const maybeId = Number(search);
    if (Number.isSafeInteger(maybeId)) {
      query = query.eq("player_id", maybeId);
    } else {
      query = applyTextSearch(query, search, ["player_name", "sale_type"]);
    }
  }
  if (type) query = query.eq("sale_type", type);
  if (status === "bulk") query = query.gte("total_sold", 5);
  if (status === "high_value") query = query.gte("total_cash_received", 100000);

  const { data, error } = await query;
  if (error) throw error;
  return pagedApproximateResult(((data ?? []) as CharacterSaleRow[]).map(normalizeSale), page, pageSize, from);
}

export async function getPlayerEvents(options?: QueryOptions): Promise<PagedResult<PlayerEventRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("player_events")
    .select("id, event_type, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("id", { ascending: false })
    .range(from, to);

  query = applyPlayerSearch(query, search);
  if (type) query = query.eq("event_type", type);
  const { data, error } = await query;
  if (error) throw error;
  return pagedApproximateResult((data ?? []) as PlayerEventRow[], page, pageSize, from);
}

export async function getSnapshots(options?: QueryOptions): Promise<PagedResult<SnapshotRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("player_snapshots")
    .select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("id", { ascending: false })
    .range(from, to);

  query = applyPlayerSearch(query, search);
  if (type) query = query.eq("snapshot_kind", type);
  const { data, error } = await query;
  if (error) throw error;
  const loadedRows = (data ?? []) as SnapshotRow[];
  const rows = loadedRows.slice(0, pageSize);
  const hasNextPage = loadedRows.length > pageSize;
  const totalCount = approximateTotalCount(from, rows.length, hasNextPage);
  return { rows, page, pageSize, totalCount, totalCountIsExact: false, hasNextPage };
}

export async function getLatestPlayers(options?: QueryOptions): Promise<PagedResult<SnapshotRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  let query = supabase
    .from("dashboard_player_latest")
    .select("snapshot_id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("snapshot_id", { ascending: false })
    .range(from, from + pageSize);

  query = applyPlayerSearch(query, search);
  if (type) query = query.eq("snapshot_kind", type);
  const { data, error } = await query;
  if (error) {
    return getLatestPlayersFromSnapshots(options);
  }

  const loadedRows = (data ?? []).map((row) => ({
    ...(row as Omit<SnapshotRow, "id"> & { snapshot_id: number }),
    id: (row as { snapshot_id: number }).snapshot_id,
  })) as SnapshotRow[];
  return pagedApproximateResult(loadedRows, page, pageSize, from);
}

async function getLatestPlayersFromSnapshots(options?: QueryOptions): Promise<PagedResult<SnapshotRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const scanLimit = Math.min(1000, Math.max(pageSize + 1, page * pageSize * 30));
  let query = supabase
    .from("player_snapshots")
    .select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("id", { ascending: false })
    .range(0, scanLimit - 1);

  query = applyPlayerSearch(query, search);
  if (type) query = query.eq("snapshot_kind", type);
  const { data, error } = await query;
  if (error) throw error;

  const loadedRows = (data ?? []) as SnapshotRow[];
  const uniqueRows: SnapshotRow[] = [];
  const seenPlayerIds = new Set<number>();
  for (const row of loadedRows) {
    if (seenPlayerIds.has(row.player_id)) continue;
    seenPlayerIds.add(row.player_id);
    uniqueRows.push(row);
  }

  const rows = uniqueRows.slice(from, from + pageSize);
  const hasNextPage = uniqueRows.length > from + pageSize || loadedRows.length === scanLimit;
  const totalCount = approximateTotalCount(from, rows.length, hasNextPage);
  return { rows, page, pageSize, totalCount, totalCountIsExact: false, hasNextPage };
}

export async function getPurchases(options?: QueryOptions): Promise<PagedResult<PurchaseRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, status } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("product_purchases")
    .select("id, player_id, player_name, product_name, robux_spent, purchase_id, created_at")
    .order("id", { ascending: false })
    .range(from, to);

  if (search) {
    const maybeId = Number(search);
    if (Number.isSafeInteger(maybeId)) {
      query = query.eq("player_id", maybeId);
    } else {
      query = applyTextSearch(query, search, ["player_name", "product_name", "purchase_id"]);
    }
  }
  if (status === "verified") query = query.not("purchase_id", "is", null);
  if (status === "missing_purchase_id") query = query.is("purchase_id", null);

  const { data, error } = await query;
  if (error) throw error;
  return pagedApproximateResult((data ?? []) as PurchaseRow[], page, pageSize, from);
}

export async function getSecurityEvents(options?: QueryOptions): Promise<PagedResult<SecurityRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search, type } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("security_events")
    .select("id, category, severity, player_id, player_name, created_at")
    .order("id", { ascending: false })
    .range(from, to);

  if (search) {
    const maybeId = Number(search);
    if (Number.isSafeInteger(maybeId)) {
      query = query.eq("player_id", maybeId);
    } else {
      query = applyTextSearch(query, search, ["player_name", "category", "severity"]);
    }
  }
  if (type) query = query.eq("severity", type);

  const { data, error } = await query;
  if (error) throw error;
  return pagedApproximateResult((data ?? []) as SecurityRow[], page, pageSize, from);
}

export async function getPlayerInvestigation(playerId: number): Promise<PlayerInvestigation> {
  const supabase = createServerSupabaseClient();
  const [events, snapshots, purchases, gifts, sales, security] = await Promise.all([
    supabase
      .from("player_events")
      .select("id, event_type, player_id, player_name, cash, highest_wave, total_kills, created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("player_snapshots")
      .select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("product_purchases")
      .select("id, player_id, player_name, product_name, robux_spent, purchase_id, created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("gift_logs")
      .select("id, source_event_id, giver_id, giver_name, receiver_id, receiver_name, character_name, character_id, level, mutation, trait, occurred_at, created_at")
      .or(`giver_id.eq.${playerId},receiver_id.eq.${playerId}`)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("character_sales")
      .select("id, source_event_id, player_id, player_name, sale_type, total_cash_received, total_sold, characters, occurred_at, created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("security_events")
      .select("id, category, severity, player_id, player_name, created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  return {
    playerId,
    events: (events.data ?? []) as PlayerEventRow[],
    snapshots: (snapshots.data ?? []) as SnapshotRow[],
    purchases: (purchases.data ?? []) as PurchaseRow[],
    gifts: (gifts.data ?? []) as GiftRow[],
    sales: ((sales.data ?? []) as CharacterSaleRow[]).map(normalizeSale),
    security: (security.data ?? []) as SecurityRow[],
  };
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function getPlayerEventDetail(id: number): Promise<PlayerEventDetail | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("player_events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const payload = (data.payload ?? {}) as JsonRecord;
  return {
    ...(data as PlayerEventRow),
    source_event_id: data.source_event_id,
    joined_at: data.joined_at,
    left_at: data.left_at,
    session_duration_seconds: data.session_duration_seconds,
    occurred_at: data.occurred_at,
    payload,
    inventory: asArray<InventoryEntry>(payload.inventory),
    items: asArray<ItemEntry>(payload.items),
    equipped: asArray<InventoryEntry>(payload.equipped),
  };
}

export async function getSnapshotDetail(id: number): Promise<SnapshotDetail | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("player_snapshots")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const payload = (data.payload ?? {}) as JsonRecord;
  return {
    ...(data as SnapshotRow),
    source_event_id: data.source_event_id,
    occurred_at: data.occurred_at,
    payload,
    inventory: asArray<InventoryEntry>(data.inventory),
    items: asArray<ItemEntry>(data.items),
    equipped: asArray<InventoryEntry>(data.equipped),
    changed_fields: (data.changed_fields ?? {}) as JsonRecord,
    state_hash: data.state_hash,
    profile_version: data.profile_version,
  };
}

export async function getGiftDetail(id: number): Promise<(GiftRow & { payload: JsonRecord }) | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("gift_logs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    ...(data as GiftRow),
    payload: (data.payload ?? {}) as JsonRecord,
  };
}

export async function getCharacterSaleDetail(id: number): Promise<(CharacterSaleRow & { payload: JsonRecord }) | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("character_sales")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    ...normalizeSale(data as CharacterSaleRow),
    payload: (data.payload ?? {}) as JsonRecord,
  };
}
