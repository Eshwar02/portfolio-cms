# Portfolio CMS Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete custom CMS REST API (Django + DRF + PostgreSQL) with JWT auth, all content models, CRUD, draft/publish, uploads, contact/email, and API docs — fully tested.

**Architecture:** A Django project `config` with four apps (`accounts`, `content`, `media_lib`, `contact`). DRF `ModelViewSet`s expose CRUD per content model through a router. A custom `IsAdminOrReadOnly` permission plus a shared `PublishedQuerysetMixin` make anonymous reads return only `published` rows while authenticated admins see and edit everything. SimpleJWT issues access/refresh tokens. drf-spectacular serves Swagger docs.

**Tech Stack:** Python 3.13 (fallback from 3.14 if Django incompatible), Django 5.x, djangorestframework, djangorestframework-simplejwt, drf-spectacular, django-environ, psycopg[binary], Pillow, pytest + pytest-django, PostgreSQL 18.

## Global Constraints

- Backend lives entirely under `backend/`.
- PostgreSQL only (no SQLite); connection via `.env` read by `django-environ`.
- Every content model has: `status` (choices `draft`/`published`, default `draft`), `display_order` (int, default 0), `created_at`, `updated_at`.
- Anonymous GET returns `status=published` only; authenticated admin sees all.
- All write methods (POST/PUT/PATCH/DELETE) require an authenticated admin (`is_staff`).
- JWT via SimpleJWT at `POST /api/auth/login`, `POST /api/auth/refresh`.
- API namespaced under `/api/`. Swagger UI at `/api/docs/`.
- Email uses console backend in dev (`EMAIL_BACKEND` from env).
- Tests use pytest + pytest-django; a factory/fixtures create an admin user.
- Secrets (`SECRET_KEY`, DB creds, email creds) come from `.env`; never hardcode. Commit `.env.example`.

---

### Task 1: Project scaffold, dependencies, settings, Postgres, boot check

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`, `backend/.env`
- Create: `backend/manage.py` (via django-admin)
- Create: `backend/config/{__init__,settings,urls,wsgi,asgi}.py` (via django-admin)
- Create: `backend/pytest.ini`

**Interfaces:**
- Produces: a runnable Django project importable as `config.settings`; env keys `SECRET_KEY`, `DEBUG`, `DATABASE_URL`, `EMAIL_BACKEND`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`.

- [ ] **Step 1: Create venv and verify Django imports on Python 3.14; fall back to 3.13**

```bash
cd backend 2>/dev/null || mkdir -p backend && cd backend
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -q --upgrade pip
pip install -q "Django>=5.0,<6.0"
python -c "import django; print('django', django.get_version(), 'on', __import__('sys').version.split()[0])"
```
Expected: prints a Django 5.x version without error. If it errors on Python 3.14, run `python3.13 -m venv .venv` (install python3.13 if needed) and repeat. Record the working interpreter.

- [ ] **Step 2: Write requirements.txt**

```
Django>=5.0,<6.0
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
drf-spectacular>=0.27
django-environ>=0.11
psycopg[binary]>=3.2
Pillow>=10.4
django-cors-headers>=4.4
pytest>=8.0
pytest-django>=4.8
```

- [ ] **Step 3: Install requirements**

Run: `pip install -q -r requirements.txt`
Expected: completes without error.

- [ ] **Step 4: Create the Postgres database and role**

Run:
```bash
createdb portfolio_cms 2>/dev/null && echo "db created" || echo "db may already exist"
psql -d portfolio_cms -c "SELECT 1;" && echo "reachable"
```
Expected: `reachable` with a `1` row. If a dedicated role is needed, create it and note the credentials for `.env`.

- [ ] **Step 5: Scaffold the Django project into the current dir**

Run: `django-admin startproject config .`
Expected: creates `manage.py` and `config/`.

- [ ] **Step 6: Write `.env.example` and `.env`**

`.env.example`:
```
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/portfolio_cms
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
CONTACT_RECIPIENT=owner@example.com
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```
Copy to `.env` and fill `SECRET_KEY` (generate with `python -c "import secrets;print(secrets.token_urlsafe(50))"`) and real `DATABASE_URL` (use the current OS user if local Postgres uses peer auth, e.g. `postgres://eshhh@localhost:5432/portfolio_cms`).

- [ ] **Step 7: Rewrite `config/settings.py` to use environ + DRF + Postgres**

Replace the generated settings body with:
```python
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    "accounts",
    "content",
    "media_lib",
    "contact",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [], "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

DATABASES = {"default": env.db("DATABASE_URL")}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "content.permissions.IsAdminOrReadOnly",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
}

SPECTACULAR_SETTINGS = {"TITLE": "Portfolio CMS API", "VERSION": "1.0.0"}

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])

EMAIL_BACKEND = env("EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
CONTACT_RECIPIENT = env("CONTACT_RECIPIENT", default="owner@example.com")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="noreply@portfolio.local")

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
LANGUAGE_CODE = "en-us"; TIME_ZONE = "UTC"; USE_I18N = True; USE_TZ = True
AUTH_PASSWORD_VALIDATORS = []
```

- [ ] **Step 8: Create the four empty apps**

Run: `python manage.py startapp accounts && python manage.py startapp content && python manage.py startapp media_lib && python manage.py startapp contact`
Expected: four app directories created. (Task 4 adds `content/permissions.py`; until then don't run the server with the custom permission — migrate check below only needs apps importable, so temporarily set `DEFAULT_PERMISSION_CLASSES` to `("rest_framework.permissions.AllowAny",)` and restore it in Task 4. Add a note-to-self.)

- [ ] **Step 9: Write pytest.ini**

```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings
python_files = tests.py test_*.py *_tests.py
```

- [ ] **Step 10: Verify project boots and DB connects**

Run: `python manage.py migrate && python manage.py check`
Expected: migrations apply to Postgres, `System check identified no issues`.

- [ ] **Step 11: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): scaffold Django project, settings, postgres, apps"
```

---

### Task 2: Admin user bootstrap + auth test fixtures

**Files:**
- Create: `backend/conftest.py`
- Test: `backend/accounts/tests/test_auth_setup.py`

**Interfaces:**
- Produces: pytest fixtures `admin_user` (a `User` with `is_staff=True`, username `admin`, password `adminpass123`) and `api_client` (DRF `APIClient`); `auth_client` (APIClient with admin JWT bearer set).

- [ ] **Step 1: Write conftest.py fixtures**

```python
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        username="admin", password="adminpass123", is_staff=True, email="admin@x.com"
    )

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_client(admin_user):
    client = APIClient()
    from rest_framework_simplejwt.tokens import RefreshToken
    token = RefreshToken.for_user(admin_user).access_token
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client
```

- [ ] **Step 2: Write a failing sanity test**

Create `backend/accounts/tests/__init__.py` (empty) and `backend/accounts/tests/test_auth_setup.py`:
```python
import pytest

@pytest.mark.django_db
def test_admin_fixture_is_staff(admin_user):
    assert admin_user.is_staff is True
```

- [ ] **Step 3: Run test to verify it passes**

Run: `cd backend && python -m pytest accounts/tests/test_auth_setup.py -v`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
cd .. && git add backend/ && git commit -m "test(backend): add pytest fixtures for admin auth"
```

---

### Task 3: JWT auth endpoints

**Files:**
- Modify: `backend/config/urls.py`
- Test: `backend/accounts/tests/test_jwt.py`

**Interfaces:**
- Consumes: `admin_user`, `api_client` fixtures.
- Produces: `POST /api/auth/login` (body `{username,password}` → `{access,refresh}`), `POST /api/auth/refresh` (body `{refresh}` → `{access}`).

- [ ] **Step 1: Write failing tests**

```python
import pytest

@pytest.mark.django_db
def test_login_returns_tokens(api_client, admin_user):
    r = api_client.post("/api/auth/login", {"username": "admin", "password": "adminpass123"}, format="json")
    assert r.status_code == 200
    assert "access" in r.data and "refresh" in r.data

@pytest.mark.django_db
def test_login_bad_password(api_client, admin_user):
    r = api_client.post("/api/auth/login", {"username": "admin", "password": "wrong"}, format="json")
    assert r.status_code == 401

@pytest.mark.django_db
def test_refresh_returns_access(api_client, admin_user):
    login = api_client.post("/api/auth/login", {"username": "admin", "password": "adminpass123"}, format="json")
    r = api_client.post("/api/auth/refresh", {"refresh": login.data["refresh"]}, format="json")
    assert r.status_code == 200 and "access" in r.data
```

- [ ] **Step 2: Run to verify failure**

Run: `python -m pytest accounts/tests/test_jwt.py -v`
Expected: FAIL (404, routes not defined).

- [ ] **Step 3: Wire URLs in config/urls.py**

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/auth/login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path("api/", include("content.urls")),
    path("api/", include("media_lib.urls")),
    path("api/", include("contact.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```
Note: `content.urls`, `media_lib.urls`, `contact.urls` are created in later tasks; create empty `urlpatterns = []` in each app's `urls.py` now so imports resolve:
`echo "urlpatterns = []" > content/urls.py; echo "urlpatterns = []" > media_lib/urls.py; echo "urlpatterns = []" > contact/urls.py`

- [ ] **Step 4: Run tests to verify pass**

Run: `python -m pytest accounts/tests/test_jwt.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): JWT login/refresh endpoints + spectacular docs urls"
```

---

### Task 4: Custom permission `IsAdminOrReadOnly`

**Files:**
- Create: `backend/content/permissions.py`
- Modify: `backend/config/settings.py` (restore `DEFAULT_PERMISSION_CLASSES` to the custom permission if it was set to AllowAny in Task 1)
- Test: `backend/content/tests/test_permissions.py`

**Interfaces:**
- Produces: `content.permissions.IsAdminOrReadOnly` — grants SAFE_METHODS to anyone; write methods require `request.user.is_authenticated and request.user.is_staff`.

- [ ] **Step 1: Write the permission**

```python
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
```

- [ ] **Step 2: Ensure settings reference it**

Confirm `DEFAULT_PERMISSION_CLASSES = ("content.permissions.IsAdminOrReadOnly",)` in settings (restore from any temporary AllowAny).

- [ ] **Step 3: Write failing unit test**

Create `backend/content/tests/__init__.py` (empty) and `test_permissions.py`:
```python
import pytest
from types import SimpleNamespace
from content.permissions import IsAdminOrReadOnly

def _req(method, user):
    return SimpleNamespace(method=method, user=user)

def test_get_allowed_for_anon():
    anon = SimpleNamespace(is_authenticated=False, is_staff=False)
    assert IsAdminOrReadOnly().has_permission(_req("GET", anon), None) is True

def test_post_denied_for_anon():
    anon = SimpleNamespace(is_authenticated=False, is_staff=False)
    assert IsAdminOrReadOnly().has_permission(_req("POST", anon), None) is False

def test_post_allowed_for_staff():
    staff = SimpleNamespace(is_authenticated=True, is_staff=True)
    assert IsAdminOrReadOnly().has_permission(_req("POST", staff), None) is True
```

- [ ] **Step 4: Run tests**

Run: `python -m pytest content/tests/test_permissions.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): IsAdminOrReadOnly permission"
```

---

### Task 5: Content models + migrations

**Files:**
- Create: `backend/content/models.py`
- Create: `backend/media_lib/models.py`
- Create: `backend/contact/models.py`
- Test: `backend/content/tests/test_models.py`

**Interfaces:**
- Produces: models `Profile, Project, Skill, Experience, Education, Service, Testimonial, Blog, SocialLink` (content), `Media` (media_lib), `Message` (contact). Content models define `STATUS_CHOICES`, `status`, `display_order`, `created_at`, `updated_at`.

- [ ] **Step 1: Write `content/models.py`**

```python
from django.db import models

STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]

class ContentBase(models.Model):
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
        ordering = ["display_order", "-created_at"]

class Profile(models.Model):
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    resume = models.FileField(upload_to="resume/", blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class Project(ContentBase):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)

class Skill(ContentBase):
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=120, blank=True)
    proficiency = models.IntegerField(default=0)

class Experience(ContentBase):
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

class Education(ContentBase):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    year = models.CharField(max_length=20, blank=True)

class Service(ContentBase):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)

class Testimonial(ContentBase):
    author = models.CharField(max_length=200)
    role = models.CharField(max_length=200, blank=True)
    quote = models.TextField()
    avatar = models.ImageField(upload_to="testimonials/", blank=True, null=True)

class Blog(ContentBase):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)

class SocialLink(models.Model):
    platform = models.CharField(max_length=100)
    url = models.URLField()
    display_order = models.IntegerField(default=0)
    class Meta:
        ordering = ["display_order"]
```

- [ ] **Step 2: Write `media_lib/models.py`**

```python
from django.db import models

class Media(models.Model):
    file = models.FileField(upload_to="uploads/")
    alt_text = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
```

- [ ] **Step 3: Write `contact/models.py`**

```python
from django.db import models

class Message(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    body = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at"]
```

- [ ] **Step 4: Make and apply migrations**

Run: `python manage.py makemigrations && python manage.py migrate`
Expected: migrations created for `content`, `media_lib`, `contact` and applied.

- [ ] **Step 5: Write model test**

`backend/content/tests/test_models.py`:
```python
import pytest
from content.models import Project

@pytest.mark.django_db
def test_project_defaults():
    p = Project.objects.create(title="X", slug="x")
    assert p.status == "draft"
    assert p.display_order == 0
    assert p.created_at is not None
```

- [ ] **Step 6: Run test**

Run: `python -m pytest content/tests/test_models.py -v`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): content, media, contact models + migrations"
```

---

### Task 6: Shared published-queryset mixin + Project CRUD (reference viewset)

**Files:**
- Create: `backend/content/mixins.py`
- Create: `backend/content/serializers.py` (Project serializer)
- Create: `backend/content/views.py` (ProjectViewSet)
- Create: `backend/content/urls.py` (router, register projects)
- Test: `backend/content/tests/test_projects_api.py`

**Interfaces:**
- Produces: `content.mixins.PublishedQuerysetMixin` (overrides `get_queryset` to filter `status="published"` for non-staff requests); `ProjectSerializer`; `ProjectViewSet`; route `/api/projects/`.

- [ ] **Step 1: Write the mixin**

```python
class PublishedQuerysetMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user and user.is_authenticated and user.is_staff):
            return qs.filter(status="published")
        return qs
```

- [ ] **Step 2: Write ProjectSerializer**

```python
from rest_framework import serializers
from content.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
```

- [ ] **Step 3: Write ProjectViewSet**

```python
from rest_framework import viewsets
from content.mixins import PublishedQuerysetMixin
from content.models import Project
from content.serializers import ProjectSerializer

class ProjectViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "slug"
```

- [ ] **Step 4: Register router in content/urls.py**

```python
from rest_framework.routers import DefaultRouter
from content.views import ProjectViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
urlpatterns = router.urls
```

- [ ] **Step 5: Write failing API tests**

`backend/content/tests/test_projects_api.py`:
```python
import pytest
from content.models import Project

@pytest.mark.django_db
def test_anon_sees_only_published(api_client):
    Project.objects.create(title="Pub", slug="pub", status="published")
    Project.objects.create(title="Draft", slug="draft", status="draft")
    r = api_client.get("/api/projects/")
    assert r.status_code == 200
    titles = [p["title"] for p in r.data["results"]]
    assert titles == ["Pub"]

@pytest.mark.django_db
def test_admin_sees_all(auth_client):
    Project.objects.create(title="Pub", slug="pub", status="published")
    Project.objects.create(title="Draft", slug="draft", status="draft")
    r = auth_client.get("/api/projects/")
    assert r.data["count"] == 2

@pytest.mark.django_db
def test_anon_cannot_create(api_client):
    r = api_client.post("/api/projects/", {"title": "New", "slug": "new"}, format="json")
    assert r.status_code in (401, 403)

@pytest.mark.django_db
def test_admin_can_crud(auth_client):
    r = auth_client.post("/api/projects/", {"title": "New", "slug": "new", "status": "published"}, format="json")
    assert r.status_code == 201
    r2 = auth_client.patch("/api/projects/new/", {"title": "Edited"}, format="json")
    assert r2.status_code == 200 and r2.data["title"] == "Edited"
    r3 = auth_client.delete("/api/projects/new/")
    assert r3.status_code == 204
```

- [ ] **Step 6: Run to verify fail then pass**

Run: `python -m pytest content/tests/test_projects_api.py -v`
Expected: after steps 1-4 in place, PASS (4 tests). If run before implementation, FAIL with 404.

- [ ] **Step 7: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): published mixin + Project CRUD viewset"
```

---

### Task 7: Serializers + viewsets + routes for remaining content models

**Files:**
- Modify: `backend/content/serializers.py`
- Modify: `backend/content/views.py`
- Modify: `backend/content/urls.py`
- Test: `backend/content/tests/test_all_resources_api.py`

**Interfaces:**
- Consumes: `PublishedQuerysetMixin`.
- Produces: routes `/api/skills/`, `/api/experience/`, `/api/education/`, `/api/services/`, `/api/testimonials/`, `/api/blogs/` (slug lookup), `/api/social-links/`.

- [ ] **Step 1: Append serializers to content/serializers.py**

```python
from content.models import (Skill, Experience, Education, Service,
                            Testimonial, Blog, SocialLink)

def _meta(model_cls):
    return type("Meta", (), {"model": model_cls, "fields": "__all__"})

class SkillSerializer(serializers.ModelSerializer): Meta = _meta(Skill)
class ExperienceSerializer(serializers.ModelSerializer): Meta = _meta(Experience)
class EducationSerializer(serializers.ModelSerializer): Meta = _meta(Education)
class ServiceSerializer(serializers.ModelSerializer): Meta = _meta(Service)
class TestimonialSerializer(serializers.ModelSerializer): Meta = _meta(Testimonial)
class BlogSerializer(serializers.ModelSerializer): Meta = _meta(Blog)
class SocialLinkSerializer(serializers.ModelSerializer): Meta = _meta(SocialLink)
```

- [ ] **Step 2: Append viewsets to content/views.py**

```python
from content.models import (Skill, Experience, Education, Service,
                            Testimonial, Blog, SocialLink)
from content.serializers import (SkillSerializer, ExperienceSerializer,
    EducationSerializer, ServiceSerializer, TestimonialSerializer,
    BlogSerializer, SocialLinkSerializer)

class SkillViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Skill.objects.all(); serializer_class = SkillSerializer

class ExperienceViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Experience.objects.all(); serializer_class = ExperienceSerializer

class EducationViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Education.objects.all(); serializer_class = EducationSerializer

class ServiceViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all(); serializer_class = ServiceSerializer

class TestimonialViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.all(); serializer_class = TestimonialSerializer

class BlogViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Blog.objects.all(); serializer_class = BlogSerializer; lookup_field = "slug"

class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all(); serializer_class = SocialLinkSerializer
```

- [ ] **Step 3: Register routes in content/urls.py**

```python
from content.views import (SkillViewSet, ExperienceViewSet, EducationViewSet,
    ServiceViewSet, TestimonialViewSet, BlogViewSet, SocialLinkViewSet)

router.register("skills", SkillViewSet, basename="skill")
router.register("experience", ExperienceViewSet, basename="experience")
router.register("education", EducationViewSet, basename="education")
router.register("services", ServiceViewSet, basename="service")
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("blogs", BlogViewSet, basename="blog")
router.register("social-links", SocialLinkViewSet, basename="social-link")
urlpatterns = router.urls
```

- [ ] **Step 4: Write parametrized smoke tests**

`backend/content/tests/test_all_resources_api.py`:
```python
import pytest

LIST_ENDPOINTS = [
    "/api/skills/", "/api/experience/", "/api/education/",
    "/api/services/", "/api/testimonials/", "/api/blogs/", "/api/social-links/",
]

@pytest.mark.django_db
@pytest.mark.parametrize("url", LIST_ENDPOINTS)
def test_list_endpoint_ok(api_client, url):
    r = api_client.get(url)
    assert r.status_code == 200

@pytest.mark.django_db
def test_skill_admin_create(auth_client):
    r = auth_client.post("/api/skills/", {"name": "Python", "status": "published"}, format="json")
    assert r.status_code == 201

@pytest.mark.django_db
def test_experience_requires_dates(auth_client):
    r = auth_client.post("/api/experience/", {"company": "Acme", "position": "Dev", "start_date": "2020-01-01", "status": "published"}, format="json")
    assert r.status_code == 201
```

- [ ] **Step 5: Run tests**

Run: `python -m pytest content/tests/test_all_resources_api.py -v`
Expected: PASS (9 tests: 7 parametrized + 2).

- [ ] **Step 6: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): CRUD APIs for all remaining content models"
```

---

### Task 8: Profile singleton endpoint

**Files:**
- Modify: `backend/content/serializers.py`
- Modify: `backend/content/views.py`
- Modify: `backend/content/urls.py`
- Test: `backend/content/tests/test_profile_api.py`

**Interfaces:**
- Produces: `GET /api/profile/` (returns the single Profile or empty object) and `PUT /api/profile/` (admin upsert).

- [ ] **Step 1: Add ProfileSerializer**

```python
from content.models import Profile
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
```

- [ ] **Step 2: Add ProfileView (singleton)**

In `content/views.py`:
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from content.models import Profile
from content.serializers import ProfileSerializer

class ProfileView(APIView):
    def get(self, request):
        obj = Profile.objects.first()
        return Response(ProfileSerializer(obj).data if obj else {})
    def put(self, request):
        obj = Profile.objects.first()
        ser = ProfileSerializer(obj, data=request.data) if obj else ProfileSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)
```

- [ ] **Step 3: Route it**

In `content/urls.py` add before `urlpatterns = router.urls`:
```python
from django.urls import path
from content.views import ProfileView
urlpatterns = [path("profile/", ProfileView.as_view(), name="profile")] + router.urls
```

- [ ] **Step 4: Write tests**

```python
import pytest

@pytest.mark.django_db
def test_profile_empty_get(api_client):
    r = api_client.get("/api/profile/")
    assert r.status_code == 200 and r.data == {}

@pytest.mark.django_db
def test_admin_put_creates_profile(auth_client):
    r = auth_client.put("/api/profile/", {"name": "Eshwar"}, format="json")
    assert r.status_code == 200 and r.data["name"] == "Eshwar"

@pytest.mark.django_db
def test_anon_cannot_put_profile(api_client):
    r = api_client.put("/api/profile/", {"name": "Hacker"}, format="json")
    assert r.status_code in (401, 403)
```

- [ ] **Step 5: Run tests**

Run: `python -m pytest content/tests/test_profile_api.py -v`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): profile singleton endpoint"
```

---

### Task 9: Media upload endpoint

**Files:**
- Create: `backend/media_lib/serializers.py`
- Create: `backend/media_lib/views.py`
- Create: `backend/media_lib/urls.py`
- Test: `backend/media_lib/tests/test_upload.py`

**Interfaces:**
- Produces: `POST /api/upload/` (multipart `file`, admin only) → `{id, file (url), alt_text, uploaded_at}`; rejects files > 5 MB or disallowed extensions with 400.

- [ ] **Step 1: Serializer with validation**

```python
from rest_framework import serializers
from media_lib.models import Media

ALLOWED = {"jpg", "jpeg", "png", "gif", "webp", "svg", "pdf"}
MAX_BYTES = 5 * 1024 * 1024

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "file", "alt_text", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

    def validate_file(self, f):
        ext = f.name.rsplit(".", 1)[-1].lower() if "." in f.name else ""
        if ext not in ALLOWED:
            raise serializers.ValidationError(f"Extension .{ext} not allowed")
        if f.size > MAX_BYTES:
            raise serializers.ValidationError("File exceeds 5 MB limit")
        return f
```

- [ ] **Step 2: View (admin write only)**

```python
from rest_framework import generics
from media_lib.models import Media
from media_lib.serializers import MediaSerializer

class MediaUploadView(generics.CreateAPIView):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
```

- [ ] **Step 3: Route**

`media_lib/urls.py`:
```python
from django.urls import path
from media_lib.views import MediaUploadView
urlpatterns = [path("upload/", MediaUploadView.as_view(), name="upload")]
```

- [ ] **Step 4: Write tests**

`backend/media_lib/tests/__init__.py` (empty) + `test_upload.py`:
```python
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

@pytest.mark.django_db
def test_admin_upload_ok(auth_client, tmp_path, settings):
    settings.MEDIA_ROOT = tmp_path
    f = SimpleUploadedFile("a.png", b"\x89PNG\r\n\x1a\n" + b"0" * 10, content_type="image/png")
    r = auth_client.post("/api/upload/", {"file": f}, format="multipart")
    assert r.status_code == 201 and "file" in r.data

@pytest.mark.django_db
def test_reject_bad_extension(auth_client):
    f = SimpleUploadedFile("a.exe", b"MZ", content_type="application/octet-stream")
    r = auth_client.post("/api/upload/", {"file": f}, format="multipart")
    assert r.status_code == 400

@pytest.mark.django_db
def test_anon_cannot_upload(api_client):
    f = SimpleUploadedFile("a.png", b"0", content_type="image/png")
    r = api_client.post("/api/upload/", {"file": f}, format="multipart")
    assert r.status_code in (401, 403)
```

- [ ] **Step 5: Run tests**

Run: `python -m pytest media_lib/tests/test_upload.py -v`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): media upload endpoint with validation"
```

---

### Task 10: Contact endpoint + email

**Files:**
- Create: `backend/contact/serializers.py`
- Create: `backend/contact/views.py`
- Create: `backend/contact/urls.py`
- Test: `backend/contact/tests/test_contact.py`

**Interfaces:**
- Produces: `POST /api/contact/` (public) → creates `Message`, sends email to `CONTACT_RECIPIENT`, returns 201; `GET /api/messages/` (admin) list; `PATCH /api/messages/<id>/` to mark read.

- [ ] **Step 1: Serializers**

```python
from rest_framework import serializers
from contact.models import Message

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "name", "email", "subject", "body", "created_at"]
        read_only_fields = ["id", "created_at"]

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
```

- [ ] **Step 2: Views**

```python
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, viewsets, permissions
from rest_framework.permissions import AllowAny
from contact.models import Message
from contact.serializers import ContactSerializer, MessageSerializer

class ContactCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        msg = serializer.save()
        send_mail(
            subject=f"[Portfolio] {msg.subject or 'New message'} from {msg.name}",
            message=msg.body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_RECIPIENT],
            fail_silently=True,
        )

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["get", "patch", "delete"]
```

- [ ] **Step 3: Routes**

`contact/urls.py`:
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from contact.views import ContactCreateView, MessageViewSet

router = DefaultRouter()
router.register("messages", MessageViewSet, basename="message")
urlpatterns = [path("contact/", ContactCreateView.as_view(), name="contact")] + router.urls
```

- [ ] **Step 4: Write tests**

`backend/contact/tests/__init__.py` (empty) + `test_contact.py`:
```python
import pytest
from django.core import mail
from contact.models import Message

@pytest.mark.django_db
def test_public_can_submit_and_email_sent(api_client, settings):
    settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
    r = api_client.post("/api/contact/", {"name": "A", "email": "a@x.com", "subject": "Hi", "body": "Hello"}, format="json")
    assert r.status_code == 201
    assert Message.objects.count() == 1
    assert len(mail.outbox) == 1

@pytest.mark.django_db
def test_anon_cannot_list_messages(api_client):
    r = api_client.get("/api/messages/")
    assert r.status_code in (401, 403)

@pytest.mark.django_db
def test_admin_can_mark_read(auth_client):
    m = Message.objects.create(name="A", email="a@x.com", body="hi")
    r = auth_client.patch(f"/api/messages/{m.id}/", {"read": True}, format="json")
    assert r.status_code == 200 and r.data["read"] is True
```

- [ ] **Step 5: Run tests**

Run: `python -m pytest contact/tests/test_contact.py -v`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): contact endpoint with email + admin message inbox"
```

---

### Task 11: Admin registration + full suite verification (Phase 1 exit gate)

**Files:**
- Modify: `backend/content/admin.py`, `backend/contact/admin.py`, `backend/media_lib/admin.py`
- Create: `backend/README.md`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: Django-admin registration (dev DB inspection only), a passing full test suite, and a documented run procedure.

- [ ] **Step 1: Register models in Django admin (dev inspection)**

`content/admin.py`:
```python
from django.contrib import admin
from content.models import (Profile, Project, Skill, Experience, Education,
                            Service, Testimonial, Blog, SocialLink)
for m in (Profile, Project, Skill, Experience, Education, Service, Testimonial, Blog, SocialLink):
    admin.site.register(m)
```
`contact/admin.py`:
```python
from django.contrib import admin
from contact.models import Message
admin.site.register(Message)
```
`media_lib/admin.py`:
```python
from django.contrib import admin
from media_lib.models import Media
admin.site.register(Media)
```

- [ ] **Step 2: Write backend/README.md**

Document: prerequisites (Python, Postgres), `.env` setup, `pip install -r requirements.txt`, `createdb portfolio_cms`, `python manage.py migrate`, `python manage.py createsuperuser`, `python manage.py runserver`, endpoint list, `/api/docs/`, and `python -m pytest`.

- [ ] **Step 3: Run the ENTIRE test suite**

Run: `cd backend && python -m pytest -v`
Expected: ALL tests pass (Tasks 2–10). Fix any failures before proceeding. This is the Phase 1 exit gate.

- [ ] **Step 4: Verify the schema builds and server boots**

Run: `python manage.py spectacular --file /tmp/schema.yml && echo OK` then `python manage.py check`
Expected: schema generated, `no issues`.

- [ ] **Step 5: Commit**

```bash
cd .. && git add backend/ && git commit -m "feat(backend): admin registration, README, Phase 1 verification"
```

---

## Self-Review Notes

- **Spec coverage:** auth (T3), permissions (T4), all models (T5), CRUD all resources (T6/T7), profile singleton (T8), upload+validation (T9), contact+email+inbox (T10), draft/publish filtering (T6 mixin, tested T6), API docs (T1 urls + T11 schema build), tests (every task + T11 gate). All spec §4 items mapped.
- **Placeholder scan:** no TBD/TODO; all code shown.
- **Type consistency:** `PublishedQuerysetMixin`, `IsAdminOrReadOnly`, `ProjectSerializer`/`ProjectViewSet` names consistent across T4/T6/T7. Serializer `_meta` helper produces valid `Meta` classes.
- **Deferred to later plans:** cms-admin SPA (Phase 2) and portfolio-frontend SPA (Phase 3) get separate plans after this gate passes.
