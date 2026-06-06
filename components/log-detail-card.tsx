import { formatDate, formatNumber } from "@/lib/format";
import type { InventoryEntry, ItemEntry, PlayerEventDetail, SnapshotDetail } from "@/lib/data";

function describeCharacter(entry: InventoryEntry) {
  return [
    entry.character_name ?? "Unknown",
    entry.character_id ? `ID ${entry.character_id}` : null,
    entry.level != null ? `Lv ${entry.level}` : null,
    `Mutation ${entry.mutation ?? "Normal"}`,
    `Trait ${entry.trait ?? "None"}`,
  ].filter(Boolean).join(" | ");
}

function EvidenceList<T>({
  rows,
  render,
  scrollable = false,
}: {
  rows: T[];
  render: (row: T, index: number) => string;
  scrollable?: boolean;
}) {
  if (rows.length === 0) return <div className="evidence-empty">No data recorded for this section.</div>;
  return (
    <div className={scrollable ? "evidence-list scrollable" : "evidence-list"}>
      {rows.map((row, index) => <div className="evidence-row" key={index}>{render(row, index)}</div>)}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="detail-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="evidence-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function DetailShell({
  title,
  subtitle,
  badge,
  player,
  playerId,
  time,
  eventId,
  stats,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  player: string;
  playerId: number;
  time: string;
  eventId: string;
  stats: Array<{ label: string; value: string | number }>;
  children: React.ReactNode;
}) {
  return (
    <article className="evidence-card">
      <header className="evidence-header">
        <div>
          <span className="badge">{badge}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="evidence-player">
          <strong>{player}</strong>
          <span>#{playerId}</span>
        </div>
      </header>

      <div className="evidence-meta">
        <div>
          <span>Recorded at</span>
          <strong>{time}</strong>
        </div>
        <div>
          <span>Source event ID</span>
          <strong>{eventId}</strong>
        </div>
      </div>

      <div className="detail-stats">
        {stats.map((stat) => <Stat key={stat.label} label={stat.label} value={stat.value} />)}
      </div>

      {children}
    </article>
  );
}

export function PlayerEventDetailCard({ event }: { event: PlayerEventDetail }) {
  const isJoin = event.event_type === "join";
  const recordedAt = isJoin ? event.joined_at ?? event.occurred_at : event.left_at ?? event.occurred_at;
  return (
    <DetailShell
      title={`${isJoin ? "Join" : "Leave"} Log`}
      subtitle="Player lifecycle evidence for recovery and audit checks."
      badge={event.event_type}
      player={event.player_name}
      playerId={event.player_id}
      time={formatDate(recordedAt)}
      eventId={event.source_event_id}
      stats={[
        { label: "Cash", value: formatNumber(event.cash) },
        { label: "Highest Wave", value: formatNumber(event.highest_wave) },
        { label: "Total Kills", value: formatNumber(event.total_kills) },
        { label: "Session", value: event.session_duration_seconds != null ? `${formatNumber(event.session_duration_seconds)}s` : "N/A" },
      ]}
    >
      <div className="evidence-toolbar">
        <a className="view-button" href={`/players/${event.player_id}`}>Open Player Investigation</a>
      </div>
      <div className="evidence-grid">
        <Section title="Inventory">
          <EvidenceList rows={event.inventory} render={(entry) => describeCharacter(entry)} scrollable />
        </Section>
        <Section title="Items">
          <EvidenceList rows={event.items} render={(entry: ItemEntry) => `${entry.item_name ?? "Unknown Item"} x${formatNumber(entry.quantity ?? 0)}`} scrollable />
        </Section>
        <Section title="Equipped">
          <EvidenceList rows={event.equipped} render={(entry) => describeCharacter(entry)} scrollable />
        </Section>
      </div>
    </DetailShell>
  );
}

export function SnapshotDetailCard({ snapshot }: { snapshot: SnapshotDetail }) {
  return (
    <DetailShell
      title={`${snapshot.snapshot_kind} Snapshot`}
      subtitle="Stored player-state evidence captured by the logging pipeline."
      badge={snapshot.snapshot_kind}
      player={snapshot.player_name}
      playerId={snapshot.player_id}
      time={formatDate(snapshot.occurred_at)}
      eventId={snapshot.source_event_id}
      stats={[
        { label: "Cash", value: formatNumber(snapshot.cash) },
        { label: "Highest Wave", value: formatNumber(snapshot.highest_wave) },
        { label: "Total Kills", value: formatNumber(snapshot.total_kills) },
        { label: "Profile Version", value: snapshot.profile_version ?? "N/A" },
      ]}
    >
      <div className="evidence-toolbar">
        <a className="view-button" href={`/players/${snapshot.player_id}`}>Open Player Investigation</a>
      </div>
      <div className="evidence-grid">
        <Section title="Inventory">
          <EvidenceList rows={snapshot.inventory} render={(entry) => describeCharacter(entry)} scrollable />
        </Section>
        <Section title="Items">
          <EvidenceList rows={snapshot.items} render={(entry: ItemEntry) => `${entry.item_name ?? "Unknown Item"} x${formatNumber(entry.quantity ?? 0)}`} scrollable />
        </Section>
        <Section title="Equipped">
          <EvidenceList rows={snapshot.equipped} render={(entry) => describeCharacter(entry)} scrollable />
        </Section>
      </div>
    </DetailShell>
  );
}
