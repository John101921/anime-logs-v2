import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { SnapshotTable } from "@/components/tables";
import { getSnapshots } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SnapshotsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await getSnapshots({ search: params.q, page: Number(params.page) || 1 });
  return (
    <DashboardShell title="Snapshots" active="Snapshots">
      <section className="table-card">
        <CardHeader title="Player Snapshots">
          <SearchForm placeholder="Player name or ID..." value={params.q} />
        </CardHeader>
        <SnapshotTable rows={result.rows} />
        <Pagination pathname="/snapshots" page={result.page} hasNextPage={result.hasNextPage} query={params.q} />
      </section>
    </DashboardShell>
  );
}
