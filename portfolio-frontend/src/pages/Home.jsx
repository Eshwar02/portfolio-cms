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
    <div
      id="top"
      className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <Navbar name={profile.name} />

      <Hero profile={profile} socials={data["social-links"]} />

      {profile.bio && (
        <Section id="about" title="About">
          <p className="max-w-3xl whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">
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
        <Section id="blog" title="Blog">
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
    <section className="mx-auto max-w-5xl px-4 py-20">
      <div className="flex flex-col-reverse items-start gap-8 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500">Hi, I'm</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
            {profile.name || "Your Name"}
          </h1>
          {profile.title && (
            <p className="mt-2 text-lg text-neutral-500">{profile.title}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Get in touch
            </a>
            {profile.resume && (
              <a
                href={mediaUrl(profile.resume)}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border hairline px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Résumé
              </a>
            )}
          </div>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-4 text-sm text-neutral-500">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </div>
        {img && (
          <img
            src={img}
            alt={profile.name}
            className="h-40 w-40 rounded-2xl border hairline object-cover md:h-52 md:w-52"
          />
        )}
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
          className="rounded-full border hairline px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-300"
        >
          {s.name}
          {s.category ? <span className="text-neutral-400"> · {s.category}</span> : null}
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
            className="group overflow-hidden rounded-lg border hairline transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            {img && (
              <img src={img} alt={p.title} className="h-40 w-full object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.title}</h3>
                {p.featured && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                    Featured
                  </span>
                )}
              </div>
              {p.description && (
                <p className="mt-1 line-clamp-3 text-sm text-neutral-500">{p.description}</p>
              )}
              <div className="mt-3 flex gap-3 text-sm">
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    Code
                  </a>
                )}
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    Live
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
    <div className="space-y-6 border-l hairline pl-6">
      {items.map((e) => (
        <div key={e.id} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-neutral-400" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium">
              {e.position} · <span className="text-neutral-500">{e.company}</span>
            </h3>
            <span className="text-xs text-neutral-400">
              {e.start_date} — {e.end_date || "Present"}
            </span>
          </div>
          {e.description && (
            <p className="mt-1 text-sm text-neutral-500">{e.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationList({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((e) => (
        <div key={e.id} className="rounded-lg border hairline p-4">
          <h3 className="font-medium">{e.degree}</h3>
          <p className="text-sm text-neutral-500">{e.institution}</p>
          {e.year && <p className="mt-1 text-xs text-neutral-400">{e.year}</p>}
        </div>
      ))}
    </div>
  );
}

function ServicesGrid({ services }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <div key={s.id} className="rounded-lg border hairline p-5">
          <h3 className="font-medium">{s.title}</h3>
          {s.description && (
            <p className="mt-1 text-sm text-neutral-500">{s.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function TestimonialsGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((t) => (
        <figure key={t.id} className="rounded-lg border hairline p-5">
          <blockquote className="text-sm text-neutral-600 dark:text-neutral-300">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-3 text-sm font-medium">
            {t.author}
            {t.role && <span className="text-neutral-400"> · {t.role}</span>}
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
          className="rounded-lg border hairline p-5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          <h3 className="font-medium">{b.title}</h3>
          {b.excerpt && <p className="mt-1 line-clamp-3 text-sm text-neutral-500">{b.excerpt}</p>}
          <span className="mt-3 inline-block text-sm text-blue-600 dark:text-blue-400">
            Read →
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
    "w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400/40";

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputCls}
          placeholder="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
        <input
          className={inputCls}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </div>
      <input
        className={inputCls}
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => set("subject", e.target.value)}
      />
      <textarea
        className={inputCls}
        rows={5}
        placeholder="Message"
        value={form.body}
        onChange={(e) => set("body", e.target.value)}
        required
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {busy ? "Sending…" : "Send message"}
        </button>
        {status === "ok" && <span className="text-sm text-green-600 dark:text-green-400">Thanks — I'll be in touch.</span>}
        {status === "error" && <span className="text-sm text-red-600 dark:text-red-400">Something went wrong.</span>}
      </div>
    </form>
  );
}

function Footer({ name, socials }) {
  return (
    <footer className="border-t hairline py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-neutral-500 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {name || "Portfolio"}
        </span>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white">
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
