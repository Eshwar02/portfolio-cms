# Portfolio CMS

A personal portfolio website powered by a **custom-coded CMS** (built from scratch — no Strapi/Sanity/
headless platforms). Content lives in a database and is managed through a self-built admin dashboard;
the public portfolio renders only *published* content via a REST API.

## Architecture

```
portfolio_cms/
├── backend/              Django + DRF + PostgreSQL — the custom CMS API   ✅ done
├── cms-admin/            Vite + React + Tailwind — admin dashboard SPA     ✅ done
├── portfolio-frontend/   Vite + React + Tailwind — public portfolio SPA    ✅ done
└── docs/                 design spec + implementation plans
```

**Data flow**
- Public: `Portfolio SPA → GET /api/… (published only) → DRF → PostgreSQL`
- Admin: `Admin SPA → JWT login → CRUD/publish /api/… → DRF → PostgreSQL`
- Contact: `Portfolio SPA → POST /api/contact/ → save Message + send email`

## Phase 1 — Backend (done)

Django + DRF REST API with:

- **JWT auth** (SimpleJWT) — `POST /api/auth/login`, `/api/auth/refresh`
- **Content models:** Profile, Project, Skill, Experience, Education, Service, Testimonial, Blog, SocialLink, Media, Message
- **Full CRUD** per content type; public reads return published rows only, writes require an admin
- **Draft / published** workflow
- **Media upload** with type + size validation
- **Contact form** → persists message + sends email; admin message inbox
- **OpenAPI docs** (drf-spectacular) at `/api/docs/`
- **30 passing tests** (pytest + pytest-django)

See [`backend/README.md`](backend/README.md) for setup and the full endpoint list.

## CMS Admin (`cms-admin/`)

React + Vite + Tailwind dashboard with **dark/light theme**, a **static navbar**, and sleek
hairline edges:

- JWT login with token refresh (axios interceptor)
- Config-driven CRUD for all 8 content resources (one config → list + create/edit forms)
- Profile editor, media upload, contact-message inbox (read/unread/delete)
- Draft ↔ published control per item

```bash
cd cms-admin
npm install
npm run dev        # http://localhost:5174   (set VITE_API_BASE in .env if the API isn't on :8000)
```

## Portfolio Frontend (`portfolio-frontend/`)

Public site (React + Vite + Tailwind), same design language, fetches **published** content:

- Hero/profile, About, Skills, Projects, Experience, Education, Services, Testimonials, Blog
- Blog detail pages, contact form → `POST /api/contact/`
- Dark/light theme, static navbar, responsive

```bash
cd portfolio-frontend
npm install
npm run dev        # http://localhost:5173
```

## Running the whole stack locally

1. Start PostgreSQL and follow `backend/README.md` to migrate + `createsuperuser` + `runserver` (`:8000`).
2. `cd cms-admin && npm run dev` — log in with the superuser, add content, mark items **published**.
3. `cd portfolio-frontend && npm run dev` — the public site renders the published content.

CORS is preconfigured for `localhost:5173` and `localhost:5174` via `CORS_ALLOWED_ORIGINS`.

## Tech stack

| Layer | Tech |
|-------|------|
| Backend | Python 3.14, Django 5.2, Django REST Framework |
| Auth | djangorestframework-simplejwt |
| Database | PostgreSQL 18 |
| API docs | drf-spectacular (Swagger UI) |
| Frontend | React 19 + Vite + Tailwind CSS v4, react-router, axios |

## Docs

- Design spec: [`docs/superpowers/specs/2026-09-28-portfolio-cms-design.md`](docs/superpowers/specs/2026-09-28-portfolio-cms-design.md)
- Backend plan: [`docs/superpowers/plans/2026-09-28-backend-cms.md`](docs/superpowers/plans/2026-09-28-backend-cms.md)

## License

See [LICENSE](LICENSE).
