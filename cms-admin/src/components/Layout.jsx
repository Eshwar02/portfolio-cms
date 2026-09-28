import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RESOURCE_KEYS, RESOURCES } from "../lib/resources";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui";

const navItemClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm transition-colors ${
    isActive
      ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
  }`;

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Static top navbar */}
      <header className="sticky top-0 z-20 border-b hairline bg-white/80 backdrop-blur dark:bg-neutral-900/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight">Portfolio CMS</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="sticky top-20 space-y-1">
            <NavLink to="/" end className={navItemClass}>
              Dashboard
            </NavLink>
            <div className="px-3 pt-4 pb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
              Content
            </div>
            {RESOURCE_KEYS.map((key) => (
              <NavLink key={key} to={`/r/${key}`} className={navItemClass}>
                {RESOURCES[key].label}
              </NavLink>
            ))}
            <div className="px-3 pt-4 pb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
              Site
            </div>
            <NavLink to="/profile" className={navItemClass}>
              Profile
            </NavLink>
            <NavLink to="/media" className={navItemClass}>
              Media
            </NavLink>
            <NavLink to="/messages" className={navItemClass}>
              Messages
            </NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
