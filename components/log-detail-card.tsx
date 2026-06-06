import { formatDate, formatNumber } from "@/lib/format";
import type { InventoryEntry, ItemEntry, PlayerEventDetail, SnapshotDetail } from "@/lib/data";

function describeCharacter(entry: InventoryEntry) {
  const parts = [
    entry.character_name ?? "Unknown",
    entry.character_id ? `ID: ${entry.character_id}` : null,
    entry.level != null ? `Level ${entry.level}` : null,
    `Mutation: ${entry.mutation ?? "Normal"}`,
    `Trait: ${entry.trait ?? "None"}`,
  ].filter(Boolean);
  return parts.join(" | ");
}

function InventoryList({ rows }: { rows: InventoryEntry[] }) {
  if (rows.length === 0) return <p className="detail-empty">None recorded</p>;
  return (
    <ul className="detail-list">
      {rows.map((entry, index) => <li key={`${entry.character_id ?? index}-${index}`}>{describeCharacter(entry)}</li>)}
    </ul>
  );
}

function ItemList({ rows }: { rows: ItemEntry[] }) {
  if (rows.length === 0) return <p className="detail-empty">None recorded</p>;
  return (
    <ul className="detail-list">
      {rows.map((entry, index) => (
        <li key={`${entry.item_name ?? index}-${index}`}>
          {entry.item_name ?? "Unknown Item"} x{formatNumber(entry.quantity ?? 0)}
        </li>
      ))}
    </ul>
  );
}

function DetailSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="detail-section">
      <h3>{icon} {title}</h3>
      {children}
    </section>
  );
}

export function PlayerEventDetailCard({ event }: { event: PlayerEventDetail }) {
  const isJoin = event.event_type === "join";
  const title = isJoin ? "🟢 Join" : "🔴 Leave";
  return (
    <article className="log-detail-card">
      <div className="detail-top">
        <div>
          <div className="detail-title">🦁 {title}</div>
          <div className="detail-id">Event ID: {event.source_event_id}</div>
        </div>
        <div className="detail-mascot">🦌</div>
      </div>

      <DetailSection icon="👤" title="Player">
        <p>{event.player_name} ({event.player_id})</p>
      </DetailSection>

      <DetailSection icon="🕘" title={isJoin ? "Join Time" : "Leave Time"}>
        <p>{formatDate(isJoin ? event.joined_at ?? event.occurred_at : event.left_at ?? event.occurred_at)}</p>
        {event.session_duration_seconds != null ? <p className="detail-empty">Session: {formatNumber(event.session_duration_seconds)}s</p> : null}
      </DetailSection>

      <DetailSection icon="💰" title="Cash">
        <p>{formatNumber(event.cash)}</p>
      </DetailSection>

      <DetailSection icon="📦" title="Inventory">
        <InventoryList rows={event.inventory} />
      </DetailSection>

      <DetailSection icon="🎒" title="Items">
        <ItemList rows={event.items} />
      </DetailSection>

      <DetailSection icon="⚔️" title="Equipped">
        <InventoryList rows={event.equipped} />
      </DetailSection>

      <DetailSection icon="🌊" title="Highest Wave">
        <p>{formatNumber(event.highest_wave)}</p>
      </DetailSection>

      <DetailSection icon="🔫" title="Total Kills">
        <p>{formatNumber(event.total_kills)}</p>
      </DetailSection>

      <DetailSection icon="🦁" title="FooterText">
        <p className="detail-empty">Recorded by Anime Logs v2</p>
      </DetailSection>
    </article>
  );
}

export function SnapshotDetailCard({ snapshot }: { snapshot: SnapshotDetail }) {
  return (
    <article className="log-detail-card">
      <div className="detail-top">
        <div>
          <div className="detail-title">📸 Snapshot: {snapshot.snapshot_kind}</div>
          <div className="detail-id">Event ID: {snapshot.source_event_id}</div>
        </div>
        <div className="detail-mascot">🦌</div>
      </div>

      <DetailSection icon="👤" title="Player">
        <p>{snapshot.player_name} ({snapshot.player_id})</p>
      </DetailSection>

      <DetailSection icon="🕘" title="Snapshot Time">
        <p>{formatDate(snapshot.occurred_at)}</p>
      </DetailSection>

      <DetailSection icon="💰" title="Cash">
        <p>{formatNumber(snapshot.cash)}</p>
      </DetailSection>

      <DetailSection icon="📦" title="Inventory">
        <InventoryList rows={snapshot.inventory} />
      </DetailSection>

      <DetailSection icon="🎒" title="Items">
        <ItemList rows={snapshot.items} />
      </DetailSection>

      <DetailSection icon="⚔️" title="Equipped">
        <InventoryList rows={snapshot.equipped} />
      </DetailSection>

      <DetailSection icon="🌊" title="Highest Wave">
        <p>{formatNumber(snapshot.highest_wave)}</p>
      </DetailSection>

      <DetailSection icon="🔫" title="Total Kills">
        <p>{formatNumber(snapshot.total_kills)}</p>
      </DetailSection>
    </article>
  );
}
