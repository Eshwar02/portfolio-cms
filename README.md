# Portfolio CMS

A personal portfolio website powered by a **custom-coded CMS** (built from scratch — no Strapi/Sanity/
headless platforms). Content lives in a database and is managed through a self-built admin dashboard;
the public portfolio renders only *published* content via a REST API.

## Architecture

```
portfolio_cms/
├── backend/              Django + DRF + PostgreSQL — the custom CMS API   ✅ Phase 1 complete
├── cms-admin/            Vite + React + Tailwind — admin dashboard SPA     ⏳ Phase 2
├── portfolio-frontend/   Vite + React + Tailwind — public portfolio SPA    ⏳ Phase 3
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

## Tech stack

| Layer | Tech |
|-------|------|
| Backend | Python 3.14, Django 5.2, Django REST Framework |
| Auth | djangorestframework-simplejwt |
| Database | PostgreSQL 18 |
| API docs | drf-spectacular (Swagger UI) |
| Frontend (planned) | React + Vite + Tailwind CSS, axios |

## Docs

- Design spec: [`docs/superpowers/specs/2026-09-28-portfolio-cms-design.md`](docs/superpowers/specs/2026-09-28-portfolio-cms-design.md)
- Backend plan: [`docs/superpowers/plans/2026-09-28-backend-cms.md`](docs/superpowers/plans/2026-09-28-backend-cms.md)

## License

See [LICENSE](LICENSE).
