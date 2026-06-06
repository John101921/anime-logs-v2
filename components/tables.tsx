import { formatDate, formatNumber } from "@/lib/format";
import type { PlayerEventRow, PurchaseRow, SecurityRow, SnapshotRow } from "@/lib/data";

export function PlayerEventsTable({ rows }: { rows: PlayerEventRow[] }) {
  if (rows.length === 0) return <div className="empty">No player events yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Player</th>
            <th>Cash</th>
            <th>Wave</th>
            <th>Kills</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><span className="badge">{row.event_type}</span></td>
              <td>{row.player_name} <span className="muted">#{row.player_id}</span></td>
              <td>{formatNumber(row.cash)}</td>
              <td>{formatNumber(row.highest_wave)}</td>
              <td>{formatNumber(row.total_kills)}</td>
              <td>{formatDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SnapshotTable({ rows }: { rows: SnapshotRow[] }) {
  if (rows.length === 0) return <div className="empty">No snapshots yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Kind</th>
            <th>Player</th>
            <th>Cash</th>
            <th>Wave</th>
            <th>Kills</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><span className="badge">{row.snapshot_kind}</span></td>
              <td>{row.player_name} <span className="muted">#{row.player_id}</span></td>
              <td>{formatNumber(row.cash)}</td>
              <td>{formatNumber(row.highest_wave)}</td>
              <td>{formatNumber(row.total_kills)}</td>
              <td>{formatDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PurchasesTable({ rows }: { rows: PurchaseRow[] }) {
  if (rows.length === 0) return <div className="empty">No purchases yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Player</th>
            <th>Robux</th>
            <th>Purchase ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.product_name}</td>
              <td>{row.player_name} <span className="muted">#{row.player_id}</span></td>
              <td>{formatNumber(row.robux_spent)}</td>
              <td className="muted">{row.purchase_id ?? "N/A"}</td>
              <td>{formatDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SecurityTable({ rows }: { rows: SecurityRow[] }) {
  if (rows.length === 0) return <div className="empty">No security events yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Severity</th>
            <th>Player</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.category}</td>
              <td><span className={row.severity === "critical" || row.severity === "high" ? "badge danger" : "badge"}>{row.severity}</span></td>
              <td>{row.player_name ?? "N/A"} {row.player_id ? <span className="muted">#{row.player_id}</span> : null}</td>
              <td>{formatDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
