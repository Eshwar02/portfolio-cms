# Portfolio + Custom CMS — Design Spec

**Date:** 2026-09-28
**Status:** Approved
**Source:** `Portfolio Project with CMS - Python.pdf` (29 pages)

## 1. Goal

Build a personal portfolio website powered by a **custom-coded CMS** (no Strapi/Sanity/headless
platforms). Content (projects, skills, experience, etc.) lives in a database and is managed through
a self-built admin dashboard; a public portfolio site renders only *published* content via a REST API.

## 2. Confirmed Decisions

| Area | Decision |
|------|----------|
| Backend | **Django + Django REST Framework** |
| Auth | **SimpleJWT** (access + refresh) |
| Database | **PostgreSQL** (local instance, running on :5432) |
| API docs | **drf-spectacular** (Swagger UI) |
| Frontend | **Two Vite + React + Tailwind SPAs** (portfolio + cms-admin) |
| HTTP client | **axios** |
| Build order | **Backend fully built & tested first**, then admin, then portfolio |
| UI direction | Simple, **dark + light theme**, **sleek hairline edges**, **static navbar** |
| Repo | Independent git repo rooted at `portfolio_cms/` (branch `main`) |

## 3. Architecture

```
portfolio_cms/
├── backend/              Django + DRF + PostgreSQL — the custom CMS API
├── cms-admin/            Vite + React + Tailwind — admin dashboard SPA (JWT)
├── portfolio-frontend/   Vite + React + Tailwind — public portfolio SPA
└── docs/                 specs + implementation plan
```

**Data flow**
- Public: `Portfolio SPA → GET /api/<resource>/ (published only) → DRF → Postgres`
- Admin: `Admin SPA → POST /api/auth/login (JWT) → CRUD/publish /api/<resource>/ → DRF → Postgres`
- Contact: `Portfolio SPA → POST /api/contact/ → save Message + send email`

## 4. Backend (Phase 1 — build & test first)

### Django layout
- Project package: `config` (settings split via `django-environ`, `.env`).
- Apps:
  - `accounts` — admin user + JWT auth.
  - `content` — all content models + viewsets/serializers.
  - `media_lib` — file/image upload model + endpoint.
  - `contact` — contact `Message` model + email on submit.

### Models
`content` app (each content model has `status` ∈ {draft, published}, `display_order`,
`created_at`, `updated_at` unless noted):
- **Profile** — singleton: name, title, bio, profile_image, resume, email, phone, location.
- **Project** — title, slug, description, image, github_url, live_url, featured (bool), display_order, status.
- **Skill** — name, category, proficiency (int), display_order, status.
- **Experience** — company, position, description, start_date, end_date (nullable = current), display_order, status.
- **Education** — institution, degree, description, year, display_order, status.
- **Service** — title, description, icon, display_order, status.
- **Testimonial** — author, role, quote, avatar, display_order, status.
- **Blog** — title, slug, excerpt, body, cover_image, published_at, status.
- **SocialLink** — platform, url, display_order.
- **Media** (`media_lib`) — file, alt_text, uploaded_at.
- **Message** (`contact`) — name, email, subject, body, created_at, read (bool).

### Auth & permissions
- `POST /api/auth/login` → access + refresh; `POST /api/auth/refresh`.
- Custom `IsAdminOrReadOnly`: unauthenticated/GET allowed but queryset filtered to `status=published`;
  write methods require authenticated admin; admin sees drafts + published.

### APIs
- One DRF `ModelViewSet` + router registration per content model → CRUD at `/api/<resource>/`
  and `/api/<resource>/<id>/`. `slug`-based detail where a slug field exists.
- **Profile** exposed as a singleton: `GET /api/profile/`, `PUT /api/profile/` (admin).
- **Upload**: `POST /api/upload/` (multipart, image/file validation: type + size limit) → returns media URL.
- **Contact**: `POST /api/contact/` → persist `Message`, send email (console backend in dev,
  SMTP via env in prod); admin can `GET /api/messages/` and mark read.
- Media served via `MEDIA_URL`/`MEDIA_ROOT` in dev.

### API documentation
- `drf-spectacular`: schema at `/api/schema/`, Swagger UI at `/api/docs/`.

### Testing (Phase 1 exit criteria)
`pytest` + `pytest-django`. Phase 1 is **not complete** until these pass:
- Auth: valid/invalid login, refresh, protected endpoint rejects anon writes.
- Permissions: anonymous GET returns published only; admin GET returns drafts too.
- CRUD: create/read/update/delete for each content model (admin).
- Draft/publish: draft item hidden from public list, visible to admin.
- Upload: valid file accepted, invalid type/oversize rejected.
- Contact: POST creates Message and triggers email send (assert outbox).

## 5. Phase 2 — CMS Admin (Vite + React + Tailwind)
- JWT login page → token stored (memory + refresh flow), axios interceptor attaches Bearer.
- Dashboard shell: **static top navbar**, sidebar nav, **dark/light theme toggle** (persisted),
  **sleek hairline borders/dividers**, simple/minimal layout.
- CRUD screens for every content model (list + create/edit forms), media upload UI,
  draft/publish toggle, contact-message inbox (read/unread).

## 6. Phase 3 — Portfolio Frontend (Vite + React + Tailwind)
- Public sections/pages: Home, About, Projects, Skills, Experience, Blog, Contact.
- Fetches published content via axios; contact form → `POST /api/contact/`.
- Same design language: **static navbar, dark/light theme, sleek edges**, responsive, SEO meta tags.
- Optional (frontend phase): pull real design references via the inspo tool for visual polish.

## 7. Build Order (hierarchy)
1. Repo + tooling + Postgres + Django skeleton
2. JWT auth + custom permission
3. All content models + migrations
4. Serializers + viewsets + routers (CRUD) + draft/publish filtering
5. Upload endpoint + contact/email
6. drf-spectacular docs + full pytest suite → **verify Phase 1 ✅**
7. CMS admin SPA
8. Portfolio frontend SPA
9. Integration pass + deployment config (backend → Render/Railway, frontends → Vercel/Netlify)

## 8. Non-Goals (YAGNI for v1)
- No multi-user roles beyond a single admin.
- No headless-CMS-style dynamic content-type builder (models are code-defined).
- No i18n, no comments system, no analytics.
- Deployment automation is documented, not scripted, in v1.

## 9. Risks
- **Python 3.14 vs Django:** Django officially targets 3.12/3.13. Verify Django boots on 3.14 during
  setup; fall back to a 3.13 virtualenv if incompatibilities surface.
- **Local Postgres auth:** confirm a role/db can be created for the project during setup.
