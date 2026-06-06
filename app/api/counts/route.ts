import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const countTargets = [
  ["players", "dashboard_player_latest"],
  ["events", "player_events"],
  ["snapshots", "player_snapshots"],
  ["purchases", "product_purchases"],
  ["gifts", "gift_logs"],
  ["sales", "character_sales"],
  ["security", "security_events"],
] as const;

type Counts = {
  players: number | null;
  events: number | null;
  snapshots: number | null;
  purchases: number | null;
  gifts: number | null;
  sales: number | null;
  security: number | null;
};

async function getExactCount(supabase: ReturnType<typeof createServerSupabaseClient>, table: string) {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) {
    return { count: null, error: error.message };
  }
  return { count: count ?? 0, error: null };
}

export async function GET() {
  const startedAt = Date.now();
  const supabase = createServerSupabaseClient();
  const { data: rpcCounts, error: rpcError } = await supabase.rpc("get_dashboard_counts");

  if (!rpcError && rpcCounts && typeof rpcCounts === "object") {
    return NextResponse.json({
      counts: rpcCounts as Counts,
      errors: {},
      estimated: false,
      source: "rpc",
      duration_ms: Date.now() - startedAt,
    });
  }

  const results = await Promise.all(
    countTargets.map(async ([key, table]) => {
      const result = await getExactCount(supabase, table);
      return [key, result] as const;
    }),
  );

  const counts = {
    ...Object.fromEntries(results.map(([key, result]) => [key, result.count])),
  };
  const errors = Object.fromEntries(
    results
      .filter(([, result]) => result.error)
      .map(([key, result]) => [key, result.error]),
  );

  return NextResponse.json({
    counts,
    errors: {
      rpc: rpcError?.message,
      ...errors,
    },
    estimated: false,
    source: "fallback",
    duration_ms: Date.now() - startedAt,
  });
}
