import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-30 border-b hairline bg-white/70 backdrop-blur-md dark:bg-neutral-950/70">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <a href="#top" className="text-sm font-semibold tracking-tight">
          {name || "Portfolio"}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-md px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
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
            className="grid h-9 w-9 place-items-center rounded-md border hairline"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t hairline bg-white px-4 py-2 md:hidden dark:bg-neutral-950">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
