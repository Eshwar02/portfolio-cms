import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-lg border hairline text-[var(--muted)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)]"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
