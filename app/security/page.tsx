import { CardHeader, DashboardShell, SearchForm } from "@/components/dashboard-shell";
import { Pagination } from "@/components/pagination";
import { SecurityTable } from "@/components/tables";
import { getSecurityEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string; type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const pageSize = Number(params.pageSize) || 10;
  const result = await getSecurityEvents({ search: params.q, page: Number(params.page) || 1, pageSize, type: params.type, status: params.status });
  return (
    <DashboardShell title="Security" active="Security">
      <section className="table-card">
        <CardHeader title="Security Events">
          <SearchForm
            pathname="/security"
            placeholder="Player, category, severity..."
            value={params.q}
            type={params.type}
            status={params.status}
            pageSize={pageSize}
            typeOptions={[
              { label: "Critical", value: "critical" },
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
          />
        </CardHeader>
        <SecurityTable rows={result.rows} />
        <Pagination pathname="/security" page={result.page} hasNextPage={result.hasNextPage} query={params.q} type={params.type} status={params.status} pageSize={pageSize} recordCount={result.rows.length} />
      </section>
    </DashboardShell>
  );
}
