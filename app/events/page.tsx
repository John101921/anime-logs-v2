import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { PlayerEventsTable } from "@/components/tables";
import { getPlayerEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getPlayerEvents({ search: params.q, page: Number(params.page) || 1, pageSize, type: params.type, status: params.status });
  return (
    <DashboardShell title="Events" active="Events">
      <section className="table-card">
        <CardHeader title="Player Events">
          <SearchForm
            pathname="/events"
            placeholder="Player name or ID..."
            value={params.q}
            type={params.type}
            status={params.status}
            pageSize={pageSize}
            totalLabel="Total Events"
            totalCount={result.totalCount}
            totalCountIsExact={result.totalCountIsExact}
            typeOptions={[
              { label: "Join", value: "join" },
              { label: "Leave", value: "leave" },
            ]}
          />
        </CardHeader>
        <PlayerEventsTable rows={result.rows} />
        <Pagination pathname="/events" page={result.page} hasNextPage={result.hasNextPage} query={params.q} type={params.type} status={params.status} pageSize={pageSize} recordCount={result.rows.length} totalCount={result.totalCount} totalCountIsExact={result.totalCountIsExact} />
      </section>
    </DashboardShell>
  );
}
