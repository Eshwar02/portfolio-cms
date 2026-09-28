# Portfolio CMS — Backend

Custom-coded CMS REST API built with **Django + Django REST Framework + PostgreSQL**.
Serves published content to the public portfolio site and full CRUD (JWT-protected) to the
admin dashboard.

## Stack

- Python 3.14 (works on 3.13), Django 5.2, DRF 3.15
- SimpleJWT (auth), drf-spectacular (docs), Pillow (images), django-cors-headers
- PostgreSQL 18
- pytest + pytest-django

## Prerequisites

- Python 3.13+ and `python3-venv`
- PostgreSQL running locally on `:5432`

## Setup

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # then edit values
# generate a secret key:
python -c "import secrets;print(secrets.token_urlsafe(50))"

createdb portfolio_cms        # create the database
python manage.py migrate
python manage.py createsuperuser   # admin login for the CMS
python manage.py runserver
```

`.env` keys: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`
(`postgres://USER@/portfolio_cms`), `EMAIL_BACKEND`, `DEFAULT_FROM_EMAIL`,
`CONTACT_RECIPIENT`, `CORS_ALLOWED_ORIGINS`.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/login` | public |
| POST | `/api/auth/refresh` | public |
| GET | `/api/profile/` | public (read) |
| PUT | `/api/profile/` | admin |
| CRUD | `/api/projects/` (slug), `/api/skills/`, `/api/experience/`, `/api/education/`, `/api/services/`, `/api/testimonials/`, `/api/blogs/` (slug), `/api/social-links/` | GET public (published only), writes admin |
| POST | `/api/upload/` | admin |
| POST | `/api/contact/` | public |
| GET/PATCH/DELETE | `/api/messages/` | admin |
| GET | `/api/schema/`, `/api/docs/` | public |

Public GET requests return only `status=published` rows; authenticated staff see drafts too.

## API docs

Run the server and open <http://localhost:8000/api/docs/> (Swagger UI).

## Django admin

`/django-admin/` — for **developer DB inspection only**. The real content-management UI is the
separate React `cms-admin` app (Phase 2).

## Tests

```bash
cd backend
. .venv/bin/activate
python -m pytest -v
```

## Deployment

Production hardening is built in and gated on `DEBUG=False`: WhiteNoise static serving,
Gunicorn, HSTS + secure cookies + SSL redirect, `CSRF_TRUSTED_ORIGINS`, and a
`/api/health/` check (DB connectivity) for platform health probes.

**Files:** `build.sh` (install → collectstatic → migrate → init_admin), `Procfile`,
`render.yaml`, `.env.production.example`.

Deploy (e.g. Render): point the service at `backend/`, set the env vars from
`.env.production.example`, and the release/build step runs migrations and provisions the
admin from `DJANGO_ADMIN_*`.

### Supabase (production database)

The schema is already provisioned in the Supabase project `ystrwluykagppzrtuklt`
(all Django tables + migration/permission bookkeeping). To point the API at it, set in the
deploy environment (or a local `.env`):

```
DATABASE_URL=postgresql://postgres.ystrwluykagppzrtuklt:[DB_PASSWORD]@aws-0-<region>.pooler.supabase.com:5432/postgres
DB_SSLMODE=require
DEBUG=False
```

Grab the exact **Session pooler** connection string (with password) from
Supabase → Project Settings → Database. Because the schema is pre-migrated, `migrate` is a
no-op on first deploy.

> **Security:** enable Row Level Security on all tables (Django connects as the owner role and
> bypasses RLS, so it keeps working while the public PostgREST/anon path is blocked).
