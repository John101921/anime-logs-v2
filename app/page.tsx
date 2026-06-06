import { CardHeader, DashboardShell } from "@/components/dashboard-shell";
import { WorkbenchCard } from "@/components/operator-panels";
import { PlayerJump } from "@/components/player-jump";
import { StatCard } from "@/components/stat-card";
import { PlayerEventsTable, PurchasesTable, SecurityTable } from "@/components/tables";
import { getOverviewData } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getOverviewData();
  const totalRobux = data.purchases.reduce((sum, row) => sum + Number(row.robux_spent ?? 0), 0);
  const health = data.health;
  const lastIngested = health?.last_ingested_at ? formatDate(health.last_ingested_at) : "No data";

  return (
    <DashboardShell title="Operations" active="Home">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Anime Logs v2</p>
          <h2>Find the player, prove what happened, recover faster.</h2>
          <p>
            Use this console for item-loss checks, purchase verification, player timelines,
            and live ingestion monitoring. Everything here is server-side and paginated.
          </p>
        </div>
        <PlayerJump />
      </section>

      <section className="stats-grid">
        <StatCard label="Player events / hour" value={formatNumber(health?.player_events_last_hour ?? 0)} />
        <StatCard label="Snapshots / hour" value={formatNumber(health?.snapshots_last_hour ?? 0)} />
        <StatCard label="Purchases / hour" value={formatNumber(health?.purchases_last_hour ?? 0)} />
        <StatCard label="Recent Robux" value={formatNumber(totalRobux)} />
      </section>

      <section className="health-strip">
        <strong>Ingest health</strong>
        <span>Last database write: {lastIngested}</span>
        <span>Security events/hour: {formatNumber(health?.security_events_last_hour ?? 0)}</span>
      </section>

      <section className="workbench-grid">
        <WorkbenchCard title="Player Investigation" description="Search by Player ID/name, inspect lifecycle logs, purchases, snapshots and security events." href="/players" label="Open" />
        <WorkbenchCard title="Item Loss Evidence" description="Open snapshots and compare inventory/equipped/items around reported loss times." href="/snapshots" label="Review" />
        <WorkbenchCard title="Purchase Verification" description="Check purchase IDs, Robux spent, and missing purchase-id records." href="/purchases" label="Verify" />
        <WorkbenchCard title="Security Monitor" description="Review high-risk server-side security events by severity." href="/security" label="Monitor" />
      </section>

      <section className="table-card" style={{ marginTop: 20 }}>
        <CardHeader title="Latest Player Lifecycle Logs" />
        <PlayerEventsTable rows={data.events} />
      </section>

      <div className="split-grid">
        <section className="table-card">
          <CardHeader title="Recent Purchases" />
          <PurchasesTable rows={data.purchases} />
        </section>
        <section className="table-card">
          <CardHeader title="Recent Security" />
          <SecurityTable rows={data.security} />
        </section>
      </div>
    </DashboardShell>
  );
}
