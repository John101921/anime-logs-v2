import Link from "next/link";

function pageHref(pathname: string, page: number, values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

export function Pagination({
  pathname,
  page,
  hasNextPage,
  query,
  type,
  status,
  pageSize,
}: {
  pathname: string;
  page: number;
  hasNextPage: boolean;
  query?: string;
  type?: string;
  status?: string;
  pageSize?: number;
}) {
  const preserved = { q: query, type, status, pageSize };
  return (
    <div className="pagination">
      <Link className={page <= 1 ? "page-button disabled" : "page-button"} href={pageHref(pathname, Math.max(1, page - 1), preserved)}>
        Previous
      </Link>
      <span className="muted">Page {page}</span>
      <Link className={!hasNextPage ? "page-button disabled" : "page-button"} href={pageHref(pathname, page + 1, preserved)}>
        Next
      </Link>
    </div>
  );
}
