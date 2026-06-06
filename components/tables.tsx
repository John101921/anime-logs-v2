import { formatDate, formatNumber } from "@/lib/format";
import type { PlayerEventRow, PurchaseRow, SecurityRow, SnapshotRow } from "@/lib/data";
import Link from "next/link";

function SelectBox({ checked }: { checked?: boolean }) {
  return <span className={checked ? "checkbox checked" : "checkbox"} />;
}

export function PlayerEventsTable({ rows }: { rows: PlayerEventRow[] }) {
  if (rows.length === 0) return <div className="empty">No player events yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th className="select-cell"><SelectBox /></th>
            <th>Event</th>
            <th>Player</th>
            <th>Cash</th>
            <th>Wave</th>
            <th>Kills</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="select-cell"><SelectBox checked={index % 3 === 0} /></td>
              <td><Link href={`/events/${row.id}`}><span className="badge">{row.event_type}</span></Link></td>
              <td><Link className="row-link" href={`/events/${row.id}`}>{row.player_name} <span className="muted">#{row.player_id}</span></Link></td>
              <td>{formatNumber(row.cash)}</td>
              <td>{formatNumber(row.highest_wave)}</td>
              <td>{formatNumber(row.total_kills)}</td>
              <td>{formatDate(row.created_at)}</td>
              <td><span className="status-pill"><span className="status-dot" /> Recorded</span></td>
              <td><Link className="view-button" href={`/events/${row.id}`}>View</Link></td>
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
            <th className="select-cell"><SelectBox /></th>
            <th>Kind</th>
            <th>Player</th>
            <th>Cash</th>
            <th>Wave</th>
            <th>Kills</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="select-cell"><SelectBox checked={index % 3 === 0} /></td>
              <td><Link href={`/snapshots/${row.id}`}><span className="badge">{row.snapshot_kind}</span></Link></td>
              <td><Link className="row-link" href={`/snapshots/${row.id}`}>{row.player_name} <span className="muted">#{row.player_id}</span></Link></td>
              <td>{formatNumber(row.cash)}</td>
              <td>{formatNumber(row.highest_wave)}</td>
              <td>{formatNumber(row.total_kills)}</td>
              <td>{formatDate(row.created_at)}</td>
              <td><span className="status-pill"><span className="status-dot" /> Stored</span></td>
              <td><Link className="view-button" href={`/snapshots/${row.id}`}>View</Link></td>
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
            <th className="select-cell"><SelectBox /></th>
            <th>Product</th>
            <th>Player</th>
            <th>Robux</th>
            <th>Purchase ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="select-cell"><SelectBox checked={index % 3 === 0} /></td>
              <td>{row.product_name}</td>
              <td><span className="row-link">{row.player_name}</span> <span className="muted">#{row.player_id}</span></td>
              <td>{formatNumber(row.robux_spent)}</td>
              <td className="muted">{row.purchase_id ?? "N/A"}</td>
              <td>{formatDate(row.created_at)}</td>
              <td><span className="status-pill"><span className="status-dot" /> Verified</span></td>
              <td><span className="view-button disabled">View</span></td>
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
            <th className="select-cell"><SelectBox /></th>
            <th>Category</th>
            <th>Severity</th>
            <th>Player</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="select-cell"><SelectBox checked={index % 3 === 0} /></td>
              <td>{row.category}</td>
              <td><span className={row.severity === "critical" || row.severity === "high" ? "badge danger" : "badge"}>{row.severity}</span></td>
              <td>{row.player_name ?? "N/A"} {row.player_id ? <span className="muted">#{row.player_id}</span> : null}</td>
              <td>{formatDate(row.created_at)}</td>
              <td><span className="status-pill"><span className={row.severity === "critical" ? "status-dot inactive" : "status-dot"} /> Logged</span></td>
              <td><span className="view-button disabled">View</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
