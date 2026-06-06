import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { SecurityTable } from "@/components/tables";
import { getSecurityEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await getSecurityEvents({ search: params.q, page: Number(params.page) || 1 });
  return (
    <DashboardShell title="Security" active="Security">
      <section className="table-card">
        <CardHeader title="Security Events">
          <SearchForm placeholder="Player, category, severity..." value={params.q} />
        </CardHeader>
        <SecurityTable rows={result.rows} />
        <Pagination pathname="/security" page={result.page} hasNextPage={result.hasNextPage} query={params.q} />
      </section>
    </DashboardShell>
  );
}
