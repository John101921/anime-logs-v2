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

  const averageCash = sale.total_sold > 0 ? Math.floor(sale.total_cash_received / sale.total_sold) : 0;

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
          <div className="detail-stat"><span>Average cash each</span><strong>{formatNumber(averageCash)}</strong></div>
          <div className="detail-stat"><span>Sale type</span><strong>{sale.sale_type ?? "sale"}</strong></div>
          <div className="detail-stat"><span>Occurred</span><strong>{formatDate(sale.occurred_at)}</strong></div>
        </section>

        <section className="operator-summary-grid">
          <div className="operator-summary primary">
            <span>What this means</span>
            <strong>Characters were converted into cash by this player.</strong>
            <p>Use this sale beside nearby snapshots to confirm whether a missing unit was sold instead of lost.</p>
          </div>
          <div className="operator-summary">
            <span>Player</span>
            <strong><Link href={`/players/${sale.player_id}`}>{sale.player_name}</Link></strong>
            <p>Player ID #{sale.player_id}</p>
          </div>
          <div className="operator-summary">
            <span>Evidence ID</span>
            <strong className="mono-value">{sale.source_event_id}</strong>
            <p>Stable event ID for retry-safe ingestion.</p>
          </div>
        </section>

        <section className="evidence-section">
          <h3>Characters Sold</h3>
          <div className="character-grid">
            {sale.characters.length > 0 ? sale.characters.map((character, index) => (
              <div className="character-card" key={`${character.character_id ?? character.id ?? index}-${index}`}>
                <div className="character-card-top">
                  <strong>{character.character_name ?? character.name ?? "Unknown character"}</strong>
                  <span>Level {formatNumber(character.level ?? 0)}</span>
                </div>
                <div className="character-tags">
                  <span>{character.mutation ?? "Normal"}</span>
                  <span>{character.trait ?? "None"}</span>
                  {character.cash_received ? <span>Cash {formatNumber(character.cash_received)}</span> : null}
                </div>
                <div className="muted mono-value">{character.character_id ?? character.id ?? "No character ID"}</div>
              </div>
            )) : <div className="evidence-empty">No per-character details were included with this sale.</div>}
          </div>
        </section>
      </article>
    </DashboardShell>
  );
}
