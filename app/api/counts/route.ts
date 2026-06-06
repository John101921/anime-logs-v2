import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const countTargets = [
  ["players", "latest_player_snapshots"],
  ["events", "player_events"],
  ["snapshots", "player_snapshots"],
  ["purchases", "product_purchases"],
  ["gifts", "gift_logs"],
  ["sales", "character_sales"],
  ["security", "security_events"],
] as const;

async function getEstimatedCount(supabase: ReturnType<typeof createServerSupabaseClient>, table: string) {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "estimated", head: true });

  if (error) {
    return { count: null, error: error.message };
  }
  return { count: count ?? 0, error: null };
}

export async function GET() {
  const startedAt = Date.now();
  const supabase = createServerSupabaseClient();
  const results = await Promise.all(
    countTargets.map(async ([key, table]) => {
      const result = await getEstimatedCount(supabase, table);
      return [key, result] as const;
    }),
  );

  const counts = Object.fromEntries(results.map(([key, result]) => [key, result.count]));
  const errors = Object.fromEntries(
    results
      .filter(([, result]) => result.error)
      .map(([key, result]) => [key, result.error]),
  );

  return NextResponse.json({
    counts,
    errors,
    estimated: true,
    duration_ms: Date.now() - startedAt,
  });
}
