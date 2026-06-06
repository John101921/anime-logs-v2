import { CardHeader, DashboardShell } from "@/components/dashboard-shell";
import { WorkbenchCard } from "@/components/operator-panels";
import { PlayerJump } from "@/components/player-jump";
import { StatCard } from "@/components/stat-card";
import { PlayerEventsTable, SecurityTable } from "@/components/tables";
import { getOverviewData } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getOverviewData();
  const health = data.health;
  const lastIngested = health?.last_ingested_at ? formatDate(health.last_ingested_at) : "No data";
  const totalEventsLastHour =
    Number(health?.player_events_last_hour ?? 0) +
    Number(health?.snapshots_last_hour ?? 0) +
    Number(health?.purchases_last_hour ?? 0) +
    Number(health?.gifts_last_hour ?? 0) +
    Number(health?.sales_last_hour ?? 0) +
    Number(health?.security_events_last_hour ?? 0);

  return (
    <DashboardShell title="Home" active="Home">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Anime Logs v2</p>
          <h2>Find the player, check the evidence, move fast.</h2>
          <p>Start with a player lookup, then use the focused pages for purchases, snapshots, gifts, sales, and security.</p>
        </div>
        <PlayerJump />
      </section>

      <section className="stats-grid">
        <StatCard label="All logs / hour" value={formatNumber(totalEventsLastHour)} />
        <StatCard label="Snapshots / hour" value={formatNumber(health?.snapshots_last_hour ?? 0)} />
        <StatCard label="Purchases / hour" value={formatNumber(health?.purchases_last_hour ?? 0)} />
        <StatCard label="Security / hour" value={formatNumber(health?.security_events_last_hour ?? 0)} />
      </section>

      <section className="health-strip">
        <strong>Ingest health</strong>
        <span>Last database write: {lastIngested}</span>
        <span>Gifts/hour: {formatNumber(health?.gifts_last_hour ?? 0)}</span>
        <span>Sales/hour: {formatNumber(health?.sales_last_hour ?? 0)}</span>
      </section>

      <section className="workbench-grid">
        <WorkbenchCard title="Players" description="Open the main investigation page for a player timeline." href="/players" label="Search" />
        <WorkbenchCard title="Snapshots" description="Review inventory, items, equipped data, cash, wave, and kills." href="/snapshots" label="Inspect" />
        <WorkbenchCard title="Purchases" description="Verify Robux products and purchase IDs." href="/purchases" label="Verify" />
        <WorkbenchCard title="Gifts" description="Trace player-to-player character transfers." href="/gifts" label="Trace" />
        <WorkbenchCard title="Sales" description="Audit characters converted into cash." href="/sales" label="Audit" />
        <WorkbenchCard title="Security" description="Review suspicious or high-risk server-side events." href="/security" label="Monitor" />
      </section>

      <div className="split-grid">
        <section className="table-card">
          <CardHeader title="Latest Player Logs" />
          <PlayerEventsTable rows={data.events.slice(0, 6)} />
        </section>
        <section className="table-card">
          <CardHeader title="Recent Security" />
          <SecurityTable rows={data.security.slice(0, 6)} />
        </section>
      </div>
    </DashboardShell>
  );
}
