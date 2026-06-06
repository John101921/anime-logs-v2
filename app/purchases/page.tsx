import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { PurchasesTable } from "@/components/tables";
import { getPurchases } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getPurchases({ search: params.q, page: Number(params.page) || 1, pageSize, type: params.type, status: params.status });
  const countKey = !params.q && !params.type && !params.status ? "purchases" : undefined;
  return (
    <DashboardShell title="Purchases" active="Purchases">
      <section className="table-card">
        <CardHeader title="Product Purchases">
          <SearchForm
            pathname="/purchases"
            placeholder="Player, product, purchase ID..."
            value={params.q}
            status={params.status}
            pageSize={pageSize}
            totalLabel="Total Purchases"
            totalCount={result.totalCount}
            totalCountIsExact={result.totalCountIsExact}
            countKey={countKey}
            statusOptions={[
              { label: "Verified", value: "verified" },
              { label: "Missing purchase ID", value: "missing_purchase_id" },
            ]}
          />
        </CardHeader>
        <PurchasesTable rows={result.rows} />
        <Pagination pathname="/purchases" page={result.page} hasNextPage={result.hasNextPage} query={params.q} status={params.status} pageSize={pageSize} recordCount={result.rows.length} totalCount={result.totalCount} totalCountIsExact={result.totalCountIsExact} />
      </section>
    </DashboardShell>
  );
}
