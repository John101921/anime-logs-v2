import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { SnapshotTable } from "@/components/tables";
import { getLatestPlayers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getLatestPlayers({ search: params.q, page: Number(params.page) || 1, pageSize, type: params.type, status: params.status });

  return (
    <DashboardShell title="Players" active="Players">
      <section className="table-card">
        <CardHeader title="Latest Player State">
          <SearchForm
            pathname="/players"
            placeholder="Player name or ID..."
            value={params.q}
            type={params.type}
            status={params.status}
            pageSize={pageSize}
            totalLabel="Total Players"
            totalCount={result.totalCount}
            typeOptions={[
              { label: "Full snapshot", value: "full" },
              { label: "Compact snapshot", value: "compact" },
            ]}
          />
        </CardHeader>
        <SnapshotTable rows={result.rows} />
        <Pagination pathname="/players" page={result.page} hasNextPage={result.hasNextPage} query={params.q} type={params.type} status={params.status} pageSize={pageSize} recordCount={result.rows.length} totalCount={result.totalCount} />
      </section>
    </DashboardShell>
  );
}
