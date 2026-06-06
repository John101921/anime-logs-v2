import { DashboardShell } from "@/components/dashboard-shell";
import { PlayerJump } from "@/components/player-jump";
import { PlayerEventsTable, PurchasesTable, SecurityTable, SnapshotTable } from "@/components/tables";
import { getPlayerInvestigation } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PlayerInvestigationPage({ params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;
  const id = Number(playerId);
  if (!Number.isSafeInteger(id)) notFound();

  const data = await getPlayerInvestigation(id);
  const latestSnapshot = data.snapshots[0];
  const latestName = latestSnapshot?.player_name ?? data.events[0]?.player_name ?? data.purchases[0]?.player_name ?? `#${id}`;
  const totalRobux = data.purchases.reduce((sum, purchase) => sum + purchase.robux_spent, 0);

  return (
    <DashboardShell title="Player Investigation" active="Players">
      <div className="investigation-header">
        <div>
          <Link className="page-button" href="/players">Back to players</Link>
          <h2>{latestName}</h2>
          <p className="muted">Player ID #{id}</p>
        </div>
        <PlayerJump compact />
      </div>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-label">Lifecycle logs</div><div className="stat-value">{formatNumber(data.events.length)}</div></div>
        <div className="stat-card"><div className="stat-label">Snapshots</div><div className="stat-value">{formatNumber(data.snapshots.length)}</div></div>
        <div className="stat-card"><div className="stat-label">Purchases</div><div className="stat-value">{formatNumber(data.purchases.length)}</div></div>
        <div className="stat-card"><div className="stat-label">Robux recorded</div><div className="stat-value">{formatNumber(totalRobux)}</div></div>
      </section>

      {latestSnapshot ? (
        <section className="player-state-card">
          <div>
            <span className="eyebrow">Latest known state</span>
            <h3>{latestSnapshot.snapshot_kind} snapshot</h3>
          </div>
          <div><span>Cash</span><strong>{formatNumber(latestSnapshot.cash)}</strong></div>
          <div><span>Wave</span><strong>{formatNumber(latestSnapshot.highest_wave)}</strong></div>
          <div><span>Kills</span><strong>{formatNumber(latestSnapshot.total_kills)}</strong></div>
          <Link className="view-button" href={`/snapshots/${latestSnapshot.id}`}>Open Snapshot</Link>
        </section>
      ) : null}

      <section className="table-card">
        <div className="card-header"><h2 className="card-title">Lifecycle Timeline</h2></div>
        <PlayerEventsTable rows={data.events} />
      </section>

      <section className="table-card" style={{ marginTop: 18 }}>
        <div className="card-header"><h2 className="card-title">Snapshot Evidence</h2></div>
        <SnapshotTable rows={data.snapshots} />
      </section>

      <div className="split-grid">
        <section className="table-card">
          <div className="card-header"><h2 className="card-title">Purchases</h2></div>
          <PurchasesTable rows={data.purchases} />
        </section>
        <section className="table-card">
          <div className="card-header"><h2 className="card-title">Security</h2></div>
          <SecurityTable rows={data.security} />
        </section>
      </div>
    </DashboardShell>
  );
}
