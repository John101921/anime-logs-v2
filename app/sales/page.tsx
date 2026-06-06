import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { CharacterSalesTable } from "@/components/tables";
import { getCharacterSales } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getCharacterSales({
    search: params.q,
    page: Number(params.page) || 1,
    pageSize,
    type: params.type,
    status: params.status,
  });

  return (
    <DashboardShell title="Character Sales" active="Sales">
      <section className="table-card">
        <CardHeader title="Character Sales">
          <SearchForm
            placeholder="Player name, player ID, sale type..."
            value={params.q}
            type={params.type}
            status={params.status}
            pageSize={pageSize}
            typeOptions={[
              { label: "Single", value: "single" },
              { label: "Bulk", value: "bulk" },
            ]}
            statusOptions={[
              { label: "Bulk quantity", value: "bulk" },
              { label: "High value", value: "high_value" },
            ]}
          />
        </CardHeader>
        <CharacterSalesTable rows={result.rows} />
        <Pagination pathname="/sales" page={result.page} hasNextPage={result.hasNextPage} query={params.q} type={params.type} status={params.status} pageSize={pageSize} />
      </section>
    </DashboardShell>
  );
}
