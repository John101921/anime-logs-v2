import { DashboardShell } from "@/components/dashboard-shell";
import { getGiftDetail } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = await getGiftDetail(Number(id));

  if (!gift) notFound();

  return (
    <DashboardShell title="Gift Detail" active="Gifts">
      <div style={{ marginBottom: 16 }}>
        <Link className="page-button" href="/gifts">Back to gifts</Link>
      </div>
      <article className="evidence-card">
        <header className="evidence-header">
          <div>
            <span className="eyebrow">Gift Evidence</span>
            <h2>{gift.character_name ?? "Unknown character"}</h2>
            <p>{gift.character_id ?? "No character ID recorded"}</p>
          </div>
          <div className="evidence-player">
            <span>Recorded</span>
            <strong>{formatDate(gift.created_at)}</strong>
          </div>
        </header>

        <section className="detail-stats">
          <div className="detail-stat"><span>Level</span><strong>{formatNumber(gift.level)}</strong></div>
          <div className="detail-stat"><span>Mutation</span><strong>{gift.mutation ?? "Normal"}</strong></div>
          <div className="detail-stat"><span>Trait</span><strong>{gift.trait ?? "None"}</strong></div>
          <div className="detail-stat"><span>Occurred</span><strong>{formatDate(gift.occurred_at)}</strong></div>
        </section>

        <section className="transfer-flow">
          <div className="transfer-node">
            <span>Giver</span>
            <strong><Link href={`/players/${gift.giver_id}`}>{gift.giver_name}</Link></strong>
            <p>Player ID #{gift.giver_id}</p>
          </div>
          <div className="transfer-arrow">Transfer</div>
          <div className="transfer-node">
            <span>Receiver</span>
            <strong><Link href={`/players/${gift.receiver_id}`}>{gift.receiver_name}</Link></strong>
            <p>Player ID #{gift.receiver_id}</p>
          </div>
        </section>

        <section className="operator-summary-grid">
          <div className="operator-summary primary">
            <span>What this means</span>
            <strong>One character moved from giver to receiver.</strong>
            <p>Use this with snapshots around the same time to prove ownership before and after the transfer.</p>
          </div>
          <div className="operator-summary">
            <span>Character ID</span>
            <strong className="mono-value">{gift.character_id ?? "Not recorded"}</strong>
            <p>{gift.character_name ?? "Unknown character"}</p>
          </div>
          <div className="operator-summary">
            <span>Evidence ID</span>
            <strong className="mono-value">{gift.source_event_id}</strong>
            <p>Stable event ID for retry-safe ingestion.</p>
          </div>
        </section>
      </article>
    </DashboardShell>
  );
}
