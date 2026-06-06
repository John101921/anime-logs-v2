import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { SnapshotTable } from "@/components/tables";
import { getSnapshots } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SnapshotsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getSnapshots({ search: params.q, page: Number(params.page) || 1, pageSize, type: params.type, status: params.status });
  return (
    <DashboardShell title="Snapshots" active="Snapshots">
      <section className="table-card">
        <CardHeader title="Player Snapshots">
          <SearchForm
            pathname="/snapshots"
            placeholder="Player name or ID..."
            value={params.q}
            type={params.type}
            status={params.status}
            pageSize={pageSize}
            totalLabel="Total Snapshots"
            totalCount={result.totalCount}
            typeOptions={[
              { label: "Full snapshot", value: "full" },
              { label: "Compact snapshot", value: "compact" },
            ]}
          />
        </CardHeader>
        <SnapshotTable rows={result.rows} />
        <Pagination pathname="/snapshots" page={result.page} hasNextPage={result.hasNextPage} query={params.q} type={params.type} status={params.status} pageSize={pageSize} recordCount={result.rows.length} totalCount={result.totalCount} />
      </section>
    </DashboardShell>
  );
}
