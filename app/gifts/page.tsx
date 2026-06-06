import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { GiftsTable } from "@/components/tables";
import { getGifts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getGifts({ search: params.q, page: Number(params.page) || 1, pageSize, type: params.type });
  const countKey = !params.q && !params.type && !params.status ? "gifts" : undefined;

  return (
    <DashboardShell title="Gifts" active="Gifts">
      <section className="table-card">
        <CardHeader title="Gift Logs">
          <SearchForm
            pathname="/gifts"
            placeholder="Giver, receiver, player ID, character ID..."
            value={params.q}
            type={params.type}
            pageSize={pageSize}
            totalLabel="Total Gifts"
            totalCount={result.totalCount}
            totalCountIsExact={result.totalCountIsExact}
            countKey={countKey}
            typeOptions={[
              { label: "Mutated character", value: "mutated" },
              { label: "Trait character", value: "traited" },
            ]}
          />
        </CardHeader>
        <GiftsTable rows={result.rows} />
        <Pagination pathname="/gifts" page={result.page} hasNextPage={result.hasNextPage} query={params.q} type={params.type} pageSize={pageSize} recordCount={result.rows.length} totalCount={result.totalCount} totalCountIsExact={result.totalCountIsExact} />
      </section>
    </DashboardShell>
  );
}
