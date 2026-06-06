import { DashboardShell } from "@/components/dashboard-shell";
import { getCharacterSaleDetail } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sale = await getCharacterSaleDetail(Number(id));

  if (!sale) notFound();

  return (
    <DashboardShell title="Sale Detail" active="Sales">
      <div style={{ marginBottom: 16 }}>
        <Link className="page-button" href="/sales">Back to sales</Link>
      </div>
      <article className="evidence-card">
        <header className="evidence-header">
          <div>
            <span className="eyebrow">Character Sale Evidence</span>
            <h2>{sale.player_name}</h2>
            <p>Player #{sale.player_id}</p>
          </div>
          <div className="evidence-player">
            <span>Recorded</span>
            <strong>{formatDate(sale.created_at)}</strong>
          </div>
        </header>

        <section className="detail-stats">
          <div className="detail-stat"><span>Cash received</span><strong>{formatNumber(sale.total_cash_received)}</strong></div>
          <div className="detail-stat"><span>Characters sold</span><strong>{formatNumber(sale.total_sold)}</strong></div>
          <div className="detail-stat"><span>Sale type</span><strong>{sale.sale_type ?? "sale"}</strong></div>
          <div className="detail-stat"><span>Occurred</span><strong>{formatDate(sale.occurred_at)}</strong></div>
        </section>

        <section className="evidence-meta">
          <div><span>Player</span><strong><Link href={`/players/${sale.player_id}`}>{sale.player_name} #{sale.player_id}</Link></strong></div>
          <div><span>Event ID</span><strong>{sale.source_event_id}</strong></div>
          <div><span>Interpretation</span><strong>These characters were intentionally converted into cash. Use this page when a player reports missing units after selling.</strong></div>
          <div><span>Recorded character rows</span><strong>{formatNumber(sale.characters.length)}</strong></div>
        </section>

        <section className="evidence-section">
          <h3>Characters Sold</h3>
          <div className="evidence-list">
            {sale.characters.length > 0 ? sale.characters.map((character, index) => (
              <div className="evidence-row" key={`${character.character_id ?? character.id ?? index}-${index}`}>
                <strong>{character.character_name ?? character.name ?? "Unknown character"}</strong>
                <div className="muted">
                  ID: {character.character_id ?? character.id ?? "N/A"} | Level {formatNumber(character.level ?? 0)} | {character.mutation ?? "Normal"} | {character.trait ?? "None"}
                  {character.cash_received ? ` | Cash ${formatNumber(character.cash_received)}` : ""}
                </div>
              </div>
            )) : <div className="evidence-empty">No per-character details were included with this sale.</div>}
          </div>
        </section>

        <section className="evidence-section">
          <h3>Raw Payload</h3>
          <pre className="json-block">{JSON.stringify(sale.payload, null, 2)}</pre>
        </section>
      </article>
    </DashboardShell>
  );
}
