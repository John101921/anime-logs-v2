import clsx from "clsx";
import {
  Activity,
  ArrowRightLeft,
  Bell,
  CircleDot,
  Coins,
  Home,
  LogOut,
  Menu,
  PackageSearch,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AutoFilterSelect } from "@/components/auto-filter-select";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Activity },
  { href: "/players", label: "Players", icon: Users },
  { href: "/purchases", label: "Purchases", icon: Coins },
  { href: "/gifts", label: "Gifts", icon: ArrowRightLeft },
  { href: "/sales", label: "Sales", icon: ShoppingBag },
  { href: "/snapshots", label: "Snapshots", icon: PackageSearch },
  { href: "/security", label: "Security", icon: Shield },
];

export function DashboardShell({
  title,
  active,
  children,
}: {
  title: string;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <input className="sidebar-toggle" id="sidebar-toggle" type="checkbox" />
      <label className="sidebar-backdrop" htmlFor="sidebar-toggle" aria-label="Close sidebar" />
      <div className="app-frame">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">
              <CircleDot size={18} />
            </span>
            ANIME
          </div>

          <nav className="nav">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} className={clsx("nav-link", active === item.label && "active")} href={item.href}>
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <span className="nav-link">
              <Settings size={17} />
              Settings
            </span>
            <span className="nav-link">
              <LogOut size={17} />
              Log out
            </span>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="topbar-title">
              <label className="mobile-menu-button" htmlFor="sidebar-toggle" aria-label="Open sidebar">
                <Menu size={18} />
              </label>
              <h1>{title}</h1>
            </div>
            <div className="user-pill">
              <ThemeToggle />
              <span className="avatar">
                <Bell size={18} />
              </span>
              <span className="avatar">A</span>
              <div>
                <strong>Admin</strong>
                <div className="muted" style={{ fontSize: 12 }}>Logs console</div>
              </div>
            </div>
          </header>
          <div className="content">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function CardHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card-header">
      <h2 className="card-title">{title}</h2>
      {children}
    </div>
  );
}

export function SearchForm({
  pathname,
  placeholder,
  value,
  type,
  status,
  pageSize,
  totalLabel,
  totalCount,
  typeOptions = [],
  statusOptions = [],
}: {
  pathname: string;
  placeholder: string;
  value?: string;
  type?: string;
  status?: string;
  pageSize?: number;
  totalLabel?: string;
  totalCount?: number;
  typeOptions?: Array<{ label: string; value: string }>;
  statusOptions?: Array<{ label: string; value: string }>;
}) {
  function filterHref(nextType: string) {
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    if (nextType) params.set("type", nextType);
    if (status) params.set("status", status);
    if (pageSize) params.set("pageSize", String(pageSize));
    const suffix = params.toString();
    return suffix ? `${pathname}?${suffix}` : pathname;
  }

  return (
    <div className="table-toolbar">
      {totalLabel ? (
        <div className="table-total">
          <span>{totalLabel}</span>
          <strong>{new Intl.NumberFormat("en-US").format(totalCount ?? 0)}</strong>
        </div>
      ) : null}
      {typeOptions.length > 0 ? (
        <div className="filter-tabs">
          <Link className={!type ? "filter-tab active" : "filter-tab"} href={filterHref("")}>All</Link>
          {typeOptions.map((option) => (
            <Link key={option.value} className={type === option.value ? "filter-tab active" : "filter-tab"} href={filterHref(option.value)}>
              {option.label}
            </Link>
          ))}
        </div>
      ) : null}
      <form className="filters">
        <div style={{ position: "relative" }}>
          <Search className="muted" size={16} style={{ left: 12, position: "absolute", top: 12 }} />
          <input
            className="input"
            name="q"
            placeholder={placeholder}
            defaultValue={value}
            style={{ paddingLeft: 38 }}
          />
        </div>
        {type ? <input name="type" type="hidden" value={type} /> : null}
        {status ? <input name="status" type="hidden" value={status} /> : null}
        {pageSize ? <input name="pageSize" type="hidden" value={pageSize} /> : null}
        {statusOptions.length > 0 ? (
          <AutoFilterSelect
            name="status"
            value={status}
            options={[{ label: "Status: All", value: "" }, ...statusOptions]}
          />
        ) : null}
        <button className="button" type="submit">Search</button>
      </form>
    </div>
  );
}
