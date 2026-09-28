import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { fetchList, mediaUrl } from "../lib/api";
import Navbar from "../components/Navbar";
import Section from "../components/Section";

export default function Home() {
  const [profile, setProfile] = useState({});
  const [data, setData] = useState({
    skills: [],
    projects: [],
    experience: [],
    education: [],
    services: [],
    testimonials: [],
    blogs: [],
    "social-links": [],
  });

  useEffect(() => {
    api.get("/profile/").then((r) => setProfile(r.data || {})).catch(() => {});
    Object.keys(data).forEach((res) => {
      fetchList(res)
        .then((rows) => setData((d) => ({ ...d, [res]: rows })))
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <Navbar name={profile.name} />

      <Hero profile={profile} socials={data["social-links"]} />

      {profile.bio && (
        <Section id="about" title="About">
          <p className="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-[var(--muted)]">
            {profile.bio}
          </p>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section id="skills" title="Skills">
          <SkillsGrid skills={data.skills} />
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section id="projects" title="Projects">
          <ProjectsGrid projects={data.projects} />
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section id="experience" title="Experience">
          <Timeline items={data.experience} />
        </Section>
      )}

      {data.education.length > 0 && (
        <Section id="education" title="Education">
          <EducationList items={data.education} />
        </Section>
      )}

      {data.services.length > 0 && (
        <Section id="services" title="Services">
          <ServicesGrid services={data.services} />
        </Section>
      )}

      {data.testimonials.length > 0 && (
        <Section id="testimonials" title="Testimonials">
          <TestimonialsGrid items={data.testimonials} />
        </Section>
      )}

      {data.blogs.length > 0 && (
        <Section id="blog" title="Writing">
          <BlogGrid posts={data.blogs} />
        </Section>
      )}

      <Section id="contact" title="Contact" subtitle="Have a question or an opportunity? Say hello.">
        <ContactForm />
      </Section>

      <Footer name={profile.name} socials={data["social-links"]} />
    </div>
  );
}

function Hero({ profile, socials }) {
  const img = mediaUrl(profile.profile_image);
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-accent), transparent)" }}
      />
      <div className="mx-auto max-w-5xl px-5 py-24 sm:py-32">
        <div className="flex animate-rise flex-col-reverse items-start gap-10 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border hairline bg-[var(--panel)] px-3 py-1 text-xs text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available for work
            </div>
            <h1 className="display text-5xl font-semibold sm:text-6xl">
              {profile.name || "Your Name"}
            </h1>
            {profile.title && (
              <p className="mt-3 text-xl text-[var(--muted)]">{profile.title}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:brightness-110"
              >
                Get in touch
              </a>
              {profile.resume && (
                <a
                  href={mediaUrl(profile.resume)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border hairline px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--panel-2)]"
                >
                  Résumé ↗
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[var(--ink)]"
                  >
                    {s.platform} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
          {img && (
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-3xl opacity-20 blur-2xl"
                style={{ background: "var(--color-accent)" }}
              />
              <img
                src={img}
                alt={profile.name}
                className="relative h-44 w-44 rounded-2xl border hairline object-cover md:h-56 md:w-56"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SkillsGrid({ skills }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s.id}
          className="rounded-lg border hairline bg-[var(--panel)] px-3 py-1.5 text-sm text-[var(--ink)] transition-colors hover:border-[var(--color-accent)]"
        >
          {s.name}
          {s.category ? <span className="text-[var(--muted)]"> · {s.category}</span> : null}
        </span>
      ))}
    </div>
  );
}

function ProjectsGrid({ projects }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const img = mediaUrl(p.image);
        return (
          <article
            key={p.id}
            className="group overflow-hidden rounded-xl border hairline bg-[var(--panel)] transition-all duration-200 hover:-translate-y-1 hover:[box-shadow:0_12px_32px_-12px_rgb(0_0_0_/_0.25)]"
          >
            {img && (
              <div className="overflow-hidden">
                <img
                  src={img}
                  alt={p.title}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium">{p.title}</h3>
                {p.featured && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                    Featured
                  </span>
                )}
              </div>
              {p.description && (
                <p className="mt-1.5 line-clamp-3 text-sm text-[var(--muted)]">{p.description}</p>
              )}
              <div className="mt-4 flex gap-4 text-sm">
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                    Code ↗
                  </a>
                )}
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="space-y-8 border-l hairline pl-6">
      {items.map((e) => (
        <div key={e.id} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] bg-[var(--color-accent)]" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium">
              {e.position} <span className="text-[var(--muted)]">· {e.company}</span>
            </h3>
            <span className="text-xs tabular-nums text-[var(--muted)]">
              {e.start_date} — {e.end_date || "Present"}
            </span>
          </div>
          {e.description && <p className="mt-1.5 text-sm text-[var(--muted)]">{e.description}</p>}
        </div>
      ))}
    </div>
  );
}

function EducationList({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((e) => (
        <div key={e.id} className="rounded-xl border hairline bg-[var(--panel)] p-5">
          <h3 className="font-medium">{e.degree}</h3>
          <p className="text-sm text-[var(--muted)]">{e.institution}</p>
          {e.year && <p className="mt-1 text-xs text-[var(--muted)]">{e.year}</p>}
        </div>
      ))}
    </div>
  );
}

function ServicesGrid({ services }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <div
          key={s.id}
          className="rounded-xl border hairline bg-[var(--panel)] p-6 transition-colors hover:border-[var(--color-accent)]"
        >
          <h3 className="font-medium">{s.title}</h3>
          {s.description && <p className="mt-1.5 text-sm text-[var(--muted)]">{s.description}</p>}
        </div>
      ))}
    </div>
  );
}

function TestimonialsGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((t) => (
        <figure key={t.id} className="rounded-xl border hairline bg-[var(--panel)] p-6">
          <blockquote className="text-[var(--ink)]">“{t.quote}”</blockquote>
          <figcaption className="mt-4 text-sm font-medium">
            {t.author}
            {t.role && <span className="text-[var(--muted)]"> · {t.role}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function BlogGrid({ posts }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((b) => (
        <Link
          key={b.id}
          to={`/blog/${b.slug}`}
          className="group rounded-xl border hairline bg-[var(--panel)] p-6 transition-all duration-200 hover:-translate-y-1 hover:[box-shadow:0_12px_32px_-12px_rgb(0_0_0_/_0.25)]"
        >
          <h3 className="font-medium">{b.title}</h3>
          {b.excerpt && <p className="mt-1.5 line-clamp-3 text-sm text-[var(--muted)]">{b.excerpt}</p>}
          <span className="mt-4 inline-block text-sm text-[var(--color-accent)]">
            Read <span className="transition-transform group-hover:translate-x-0.5 inline-block">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await api.post("/contact/", form);
      setStatus("ok");
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border hairline bg-[var(--panel)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] ring-focus";

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={inputCls} placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        <input className={inputCls} type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
      </div>
      <input className={inputCls} placeholder="Subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
      <textarea className={`${inputCls} resize-y`} rows={5} placeholder="Message" value={form.body} onChange={(e) => set("body", e.target.value)} required />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:brightness-110 disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send message"}
        </button>
        {status === "ok" && <span className="text-sm text-emerald-600 dark:text-emerald-400">Thanks — I'll be in touch.</span>}
        {status === "error" && <span className="text-sm text-red-600 dark:text-red-400">Something went wrong.</span>}
      </div>
    </form>
  );
}

function Footer({ name, socials }) {
  return (
    <footer className="border-t hairline py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 text-sm text-[var(--muted)] sm:flex-row">
        <span>
          © {new Date().getFullYear()} {name || "Portfolio"}
        </span>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="hover:text-[var(--ink)]">
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
