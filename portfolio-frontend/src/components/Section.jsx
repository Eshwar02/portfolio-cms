export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-20 border-t hairline py-16">
      <div className="mx-auto max-w-5xl px-4">
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
