export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t hairline py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5">
        {title && (
          <div className="mb-10">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-[var(--muted)]">
              <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
              {id}
            </div>
            <h2 className="display text-3xl font-semibold sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-2 max-w-xl text-[var(--muted)]">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
