import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { PurchasesTable } from "@/components/tables";
import { getPurchases } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await getPurchases({ search: params.q, page: Number(params.page) || 1 });
  return (
    <DashboardShell title="Purchases" active="Purchases">
      <section className="table-card">
        <CardHeader title="Product Purchases">
          <SearchForm placeholder="Player, product, purchase ID..." value={params.q} />
        </CardHeader>
        <PurchasesTable rows={result.rows} />
        <Pagination pathname="/purchases" page={result.page} hasNextPage={result.hasNextPage} query={params.q} />
      </section>
    </DashboardShell>
  );
}
