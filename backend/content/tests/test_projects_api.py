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
    r = auth_client.post(
        "/api/projects/",
        {"title": "New", "slug": "new", "status": "published"},
        format="json",
    )
    assert r.status_code == 201
    r2 = auth_client.patch("/api/projects/new/", {"title": "Edited"}, format="json")
    assert r2.status_code == 200 and r2.data["title"] == "Edited"
    r3 = auth_client.delete("/api/projects/new/")
    assert r3.status_code == 204
