import { formatDate, formatNumber } from "@/lib/format";
import type { CharacterSaleRow, GiftRow, PlayerEventRow, PurchaseRow, SecurityRow, SnapshotRow } from "@/lib/data";
import Link from "next/link";

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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="Event"><Link href={`/events/${row.id}`}><span className="badge">{row.event_type}</span></Link></td>
              <td data-label="Player"><Link className="row-link" href={`/players/${row.player_id}`}>{row.player_name} <span className="muted">#{row.player_id}</span></Link></td>
              <td data-label="Cash">{formatNumber(row.cash)}</td>
              <td data-label="Wave">{formatNumber(row.highest_wave)}</td>
              <td data-label="Kills">{formatNumber(row.total_kills)}</td>
              <td data-label="Date">{formatDate(row.created_at)}</td>
              <td data-label="Status"><span className="status-pill"><span className="status-dot" /> Recorded</span></td>
              <td data-label="Actions"><Link className="view-button" href={`/events/${row.id}`}>View</Link></td>
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="Kind"><Link href={`/snapshots/${row.id}`}><span className="badge">{row.snapshot_kind}</span></Link></td>
              <td data-label="Player"><Link className="row-link" href={`/players/${row.player_id}`}>{row.player_name} <span className="muted">#{row.player_id}</span></Link></td>
              <td data-label="Cash">{formatNumber(row.cash)}</td>
              <td data-label="Wave">{formatNumber(row.highest_wave)}</td>
              <td data-label="Kills">{formatNumber(row.total_kills)}</td>
              <td data-label="Date">{formatDate(row.created_at)}</td>
              <td data-label="Status"><span className="status-pill"><span className="status-dot" /> Stored</span></td>
              <td data-label="Actions"><Link className="view-button" href={`/snapshots/${row.id}`}>View</Link></td>
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="Product">{row.product_name}</td>
              <td data-label="Player"><Link className="row-link" href={`/players/${row.player_id}`}>{row.player_name}</Link> <span className="muted">#{row.player_id}</span></td>
              <td data-label="Robux">{formatNumber(row.robux_spent)}</td>
              <td data-label="Purchase ID" className="muted">{row.purchase_id ?? "N/A"}</td>
              <td data-label="Date">{formatDate(row.created_at)}</td>
              <td data-label="Status"><span className="status-pill"><span className="status-dot" /> Verified</span></td>
              <td data-label="Actions"><span className="view-button disabled">View</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GiftsTable({ rows }: { rows: GiftRow[] }) {
  if (rows.length === 0) return <div className="empty">No gift logs yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Character</th>
            <th>Giver</th>
            <th>Receiver</th>
            <th>Level</th>
            <th>Mutation / Trait</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="Character">
                <Link className="row-link" href={`/gifts/${row.id}`}>{row.character_name ?? "Unknown"}</Link>
                <div className="muted">{row.character_id ?? "No character ID"}</div>
              </td>
              <td data-label="Giver"><Link className="row-link" href={`/players/${row.giver_id}`}>{row.giver_name}</Link> <span className="muted">#{row.giver_id}</span></td>
              <td data-label="Receiver"><Link className="row-link" href={`/players/${row.receiver_id}`}>{row.receiver_name}</Link> <span className="muted">#{row.receiver_id}</span></td>
              <td data-label="Level">{formatNumber(row.level)}</td>
              <td data-label="Mutation / Trait"><span className="badge">{row.mutation ?? "Normal"}</span> <span className="muted">{row.trait ?? "None"}</span></td>
              <td data-label="Date">{formatDate(row.created_at)}</td>
              <td data-label="Actions"><Link className="view-button" href={`/gifts/${row.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CharacterSalesTable({ rows }: { rows: CharacterSaleRow[] }) {
  if (rows.length === 0) return <div className="empty">No character sales yet.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Sale Type</th>
            <th>Cash Received</th>
            <th>Characters Sold</th>
            <th>Character Preview</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const firstCharacter = row.characters[0];
            const characterName = firstCharacter?.character_name ?? firstCharacter?.name ?? "No character details";
            const extraCount = Math.max(0, row.characters.length - 1);
            return (
              <tr key={row.id}>
                <td data-label="Player"><Link className="row-link" href={`/players/${row.player_id}`}>{row.player_name}</Link> <span className="muted">#{row.player_id}</span></td>
                <td data-label="Sale Type"><span className="badge">{row.sale_type ?? "sale"}</span></td>
                <td data-label="Cash Received">{formatNumber(row.total_cash_received)}</td>
                <td data-label="Characters Sold">{formatNumber(row.total_sold)}</td>
                <td data-label="Character Preview">
                  {characterName}
                  {extraCount > 0 ? <span className="muted"> +{extraCount} more</span> : null}
                </td>
                <td data-label="Date">{formatDate(row.created_at)}</td>
                <td data-label="Actions"><Link className="view-button" href={`/sales/${row.id}`}>View</Link></td>
              </tr>
            );
          })}
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="Category">{row.category}</td>
              <td data-label="Severity"><span className={row.severity === "critical" || row.severity === "high" ? "badge danger" : "badge"}>{row.severity}</span></td>
              <td data-label="Player">{row.player_name ?? "N/A"} {row.player_id ? <span className="muted">#{row.player_id}</span> : null}</td>
              <td data-label="Date">{formatDate(row.created_at)}</td>
              <td data-label="Status"><span className="status-pill"><span className={row.severity === "critical" ? "status-dot inactive" : "status-dot"} /> Logged</span></td>
              <td data-label="Actions"><span className="view-button disabled">View</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
