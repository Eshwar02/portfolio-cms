import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RESOURCE_KEYS, RESOURCES } from "../lib/resources";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui";

const navItemClass = ({ isActive }) =>
  `group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive
      ? "bg-[var(--panel-2)] font-medium text-[var(--ink)]"
      : "text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]"
  }`;

function Dot({ active }) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full transition-colors ${
        active ? "bg-[var(--color-accent)]" : "bg-[var(--line-strong)] group-hover:bg-[var(--muted)]"
      }`}
    />
  );
}

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Static top navbar */}
      <header className="sticky top-0 z-30 border-b hairline bg-[color-mix(in_oklab,var(--panel)_80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--color-accent)] text-xs font-bold text-white shadow-sm">
              P
            </span>
            <div className="leading-none">
              <span className="text-sm font-semibold tracking-tight">Portfolio CMS</span>
              <span className="ml-2 rounded-full bg-[var(--panel-2)] px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-8 sm:px-6">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-0.5">
            <NavLink to="/" end className={navItemClass}>
              {({ isActive }) => (
                <>
                  <Dot active={isActive} />
                  Dashboard
                </>
              )}
            </NavLink>
            <div className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Content
            </div>
            {RESOURCE_KEYS.map((key) => (
              <NavLink key={key} to={`/r/${key}`} className={navItemClass}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} />
                    {RESOURCES[key].label}
                  </>
                )}
              </NavLink>
            ))}
            <div className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Site
            </div>
            {[
              ["/profile", "Profile"],
              ["/media", "Media"],
              ["/messages", "Messages"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} className={navItemClass}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 animate-rise">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
