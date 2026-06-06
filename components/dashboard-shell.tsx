import clsx from "clsx";
import {
  Activity,
  Bell,
  CircleDot,
  Coins,
  Home,
  LogOut,
  PackageSearch,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Activity },
  { href: "/players", label: "Players", icon: Users },
  { href: "/purchases", label: "Purchases", icon: Coins },
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
            <h1>{title}</h1>
            <div className="user-pill">
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
  placeholder,
  value,
}: {
  placeholder: string;
  value?: string;
}) {
  return (
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
      <button className="button" type="submit">Search</button>
    </form>
  );
}
