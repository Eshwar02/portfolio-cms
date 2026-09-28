// SaaS-grade themed primitives. Token-driven surfaces, cool-blue accent,
// hairline edges, subtle focus rings and hover lift.

export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-[var(--radius-xl2)] border hairline bg-[var(--panel)] [box-shadow:var(--shadow)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ring-focus active:scale-[0.98]";
  const variants = {
    primary:
      "bg-[var(--color-accent)] text-white shadow-sm hover:brightness-110 hover:-translate-y-px",
    ghost:
      "border hairline bg-transparent text-[var(--ink)] hover:bg-[var(--panel-2)]",
    subtle:
      "bg-[var(--panel-2)] text-[var(--ink)] hover:brightness-95 dark:hover:brightness-125",
    danger:
      "border hairline text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

const fieldBase =
  "w-full rounded-lg border hairline bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition-shadow ring-focus";

export function Input(props) {
  return <input {...props} className={`${fieldBase} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`${fieldBase} resize-y ${props.className || ""}`} />;
}

export function Select({ options = [], ...props }) {
  return (
    <select {...props} className={`${fieldBase} ${props.className || ""}`}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral:
      "bg-[var(--panel-2)] text-[var(--muted)] ring-1 ring-inset ring-[var(--line)]",
    green:
      "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400",
    amber:
      "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400",
    accent:
      "bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[var(--color-accent)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--color-accent)_25%,transparent)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
