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
  const pages = Array.from(new Set([1, Math.max(1, page - 1), page, page + 1, page + 2])).filter((item) => item > 0);
  return (
    <div className="pagination">
      <div className="page-size-summary">
        <span>Show</span>
        <strong>{pageSize ?? 10}</strong>
      </div>
      <div className="page-controls">
        <Link className={page <= 1 ? "page-icon disabled" : "page-icon"} href={pageHref(pathname, Math.max(1, page - 1), preserved)}>
          ‹
        </Link>
        {pages.map((item) => (
          <Link key={item} className={item === page ? "page-number active" : "page-number"} href={pageHref(pathname, item, preserved)}>
            {item}
          </Link>
        ))}
        {hasNextPage ? <span className="muted">...</span> : null}
        <Link className={!hasNextPage ? "page-icon disabled" : "page-icon"} href={pageHref(pathname, page + 1, preserved)}>
          ›
        </Link>
      </div>
    </div>
  );
}
