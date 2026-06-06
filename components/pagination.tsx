import Link from "next/link";

function pageHref(pathname: string, page: number, query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

export function Pagination({
  pathname,
  page,
  hasNextPage,
  query,
}: {
  pathname: string;
  page: number;
  hasNextPage: boolean;
  query?: string;
}) {
  return (
    <div className="pagination">
      <Link className={page <= 1 ? "page-button disabled" : "page-button"} href={pageHref(pathname, Math.max(1, page - 1), query)}>
        Previous
      </Link>
      <span className="muted">Page {page}</span>
      <Link className={!hasNextPage ? "page-button disabled" : "page-button"} href={pageHref(pathname, page + 1, query)}>
        Next
      </Link>
    </div>
  );
}
