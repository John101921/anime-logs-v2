import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { SnapshotTable } from "@/components/tables";
import { getLatestPlayers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await getLatestPlayers({ search: params.q, page: Number(params.page) || 1 });

  return (
    <DashboardShell title="Players" active="Players">
      <section className="table-card">
        <CardHeader title="Latest Player State">
          <SearchForm placeholder="Player name or ID..." value={params.q} />
        </CardHeader>
        <SnapshotTable rows={result.rows} />
        <Pagination pathname="/players" page={result.page} hasNextPage={result.hasNextPage} query={params.q} />
      </section>
    </DashboardShell>
  );
}
