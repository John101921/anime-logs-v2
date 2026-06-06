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

export type PurchaseRow = {
  id: number;
  player_id: number;
  player_name: string;
  product_name: string;
  robux_spent: number;
  purchase_id: string | null;
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

export type QueryOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type PagedResult<T> = {
  rows: T[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
};

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function normalizeQueryOptions(options: QueryOptions = {}) {
  return {
    page: Math.max(1, Number(options.page) || 1),
    pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, Number(options.pageSize) || DEFAULT_PAGE_SIZE)),
    search: (options.search ?? "").trim(),
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

export async function getOverviewData() {
  const supabase = createServerSupabaseClient();

  const [events, snapshots, purchases, security] = await Promise.all([
    supabase.from("player_events").select("id, event_type, player_id, player_name, cash, highest_wave, total_kills, created_at").order("created_at", { ascending: false }).limit(12),
    supabase.from("player_snapshots").select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("product_purchases").select("id, player_id, player_name, product_name, robux_spent, purchase_id, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("security_events").select("id, category, severity, player_id, player_name, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  return {
    events: (events.data ?? []) as PlayerEventRow[],
    snapshots: (snapshots.data ?? []) as SnapshotRow[],
    purchases: (purchases.data ?? []) as PurchaseRow[],
    security: (security.data ?? []) as SecurityRow[],
  };
}

export async function getPlayerEvents(options?: QueryOptions): Promise<PagedResult<PlayerEventRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("player_events")
    .select("id, event_type, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  query = applyPlayerSearch(query, search);
  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as PlayerEventRow[];
  return { rows: rows.slice(0, pageSize), page, pageSize, hasNextPage: rows.length > pageSize };
}

export async function getSnapshots(options?: QueryOptions): Promise<PagedResult<SnapshotRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("player_snapshots")
    .select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  query = applyPlayerSearch(query, search);
  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as SnapshotRow[];
  return { rows: rows.slice(0, pageSize), page, pageSize, hasNextPage: rows.length > pageSize };
}

export async function getLatestPlayers(options?: QueryOptions): Promise<PagedResult<SnapshotRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("latest_player_snapshots")
    .select("id, snapshot_kind, player_id, player_name, cash, highest_wave, total_kills, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  query = applyPlayerSearch(query, search);
  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as SnapshotRow[];
  return { rows: rows.slice(0, pageSize), page, pageSize, hasNextPage: rows.length > pageSize };
}

export async function getPurchases(options?: QueryOptions): Promise<PagedResult<PurchaseRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("product_purchases")
    .select("id, player_id, player_name, product_name, robux_spent, purchase_id, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    const maybeId = Number(search);
    if (Number.isSafeInteger(maybeId)) {
      query = query.eq("player_id", maybeId);
    } else {
      query = applyTextSearch(query, search, ["player_name", "product_name", "purchase_id"]);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as PurchaseRow[];
  return { rows: rows.slice(0, pageSize), page, pageSize, hasNextPage: rows.length > pageSize };
}

export async function getSecurityEvents(options?: QueryOptions): Promise<PagedResult<SecurityRow>> {
  const supabase = createServerSupabaseClient();
  const { page, pageSize, search } = normalizeQueryOptions(options);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  let query = supabase
    .from("security_events")
    .select("id, category, severity, player_id, player_name, created_at")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    const maybeId = Number(search);
    if (Number.isSafeInteger(maybeId)) {
      query = query.eq("player_id", maybeId);
    } else {
      query = applyTextSearch(query, search, ["player_name", "category", "severity"]);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as SecurityRow[];
  return { rows: rows.slice(0, pageSize), page, pageSize, hasNextPage: rows.length > pageSize };
}
