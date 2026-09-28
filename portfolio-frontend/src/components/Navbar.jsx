import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["blog", "Blog"],
  ["contact", "Contact"],
];

export default function Navbar({ name }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors ${
        scrolled
          ? "hairline bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--ink)] text-[11px] font-bold text-[var(--bg)]">
            {(name || "P").charAt(0).toUpperCase()}
          </span>
          {name || "Portfolio"}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              {label}
            </a>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border hairline"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t hairline bg-[var(--bg)] px-5 py-2 md:hidden">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
