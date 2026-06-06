import { CardHeader, DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { PlayerEventsTable, PurchasesTable, SecurityTable, SnapshotTable } from "@/components/tables";
import { getOverviewData } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getOverviewData();
  const totalRobux = data.purchases.reduce((sum, row) => sum + Number(row.robux_spent ?? 0), 0);
  const health = data.health;
  const lastIngested = health?.last_ingested_at ? formatDate(health.last_ingested_at) : "No data";

  return (
    <DashboardShell title="Dashboard" active="Home">
      <section className="stats-grid">
        <StatCard label="Player events / hour" value={formatNumber(health?.player_events_last_hour ?? 0)} />
        <StatCard label="Snapshots / hour" value={formatNumber(health?.snapshots_last_hour ?? 0)} />
        <StatCard label="Purchases / hour" value={formatNumber(health?.purchases_last_hour ?? 0)} />
        <StatCard label="Recent Robux" value={formatNumber(totalRobux)} />
      </section>

      <section className="table-card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Ingest Health</h2>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              Last database write: {lastIngested}. Security events last hour: {formatNumber(health?.security_events_last_hour ?? 0)}.
            </p>
          </div>
        </div>
      </section>

      <section className="table-card" style={{ marginBottom: 20 }}>
        <CardHeader title="Recent Player Events" />
        <PlayerEventsTable rows={data.events} />
      </section>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
        <section className="table-card">
          <CardHeader title="Purchases" />
          <PurchasesTable rows={data.purchases} />
        </section>
        <section className="table-card">
          <CardHeader title="Security" />
          <SecurityTable rows={data.security} />
        </section>
      </div>

      <section className="table-card" style={{ marginTop: 20 }}>
        <CardHeader title="Snapshots" />
        <SnapshotTable rows={data.snapshots} />
      </section>
    </DashboardShell>
  );
}
