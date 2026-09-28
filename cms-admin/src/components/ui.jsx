// Small set of themed primitives sharing the sleek-hairline design language.

export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-lg border hairline bg-white dark:bg-neutral-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
    ghost:
      "border hairline bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
    danger:
      "border hairline text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400/40 ${props.className || ""}`}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400/40 ${props.className || ""}`}
    />
  );
}

export function Select({ options = [], ...props }) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400/40 ${props.className || ""}`}
    >
      {options.map((o) => (
        <option key={o} value={o} className="text-neutral-900">
          {o}
        </option>
      ))}
    </select>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
    green: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
