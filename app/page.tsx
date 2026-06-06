import { CardHeader, DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { PlayerEventsTable, PurchasesTable, SecurityTable, SnapshotTable } from "@/components/tables";
import { getOverviewData } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getOverviewData();
  const totalRobux = data.purchases.reduce((sum, row) => sum + Number(row.robux_spent ?? 0), 0);

  return (
    <DashboardShell title="Dashboard" active="Home">
      <section className="stats-grid">
        <StatCard label="Recent events" value={formatNumber(data.events.length)} />
        <StatCard label="Recent snapshots" value={formatNumber(data.snapshots.length)} />
        <StatCard label="Recent purchases" value={formatNumber(data.purchases.length)} />
        <StatCard label="Recent Robux" value={formatNumber(totalRobux)} />
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
