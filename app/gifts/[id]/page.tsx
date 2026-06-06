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

        <section className="evidence-meta">
          <div><span>Giver</span><strong><Link href={`/players/${gift.giver_id}`}>{gift.giver_name} #{gift.giver_id}</Link></strong></div>
          <div><span>Receiver</span><strong><Link href={`/players/${gift.receiver_id}`}>{gift.receiver_name} #{gift.receiver_id}</Link></strong></div>
          <div><span>Event ID</span><strong>{gift.source_event_id}</strong></div>
          <div><span>Interpretation</span><strong>One character moved from giver to receiver. Use this with nearby snapshots to prove ownership before and after the gift.</strong></div>
        </section>

        <section className="evidence-section">
          <h3>Raw Payload</h3>
          <pre className="json-block">{JSON.stringify(gift.payload, null, 2)}</pre>
        </section>
      </article>
    </DashboardShell>
  );
}
