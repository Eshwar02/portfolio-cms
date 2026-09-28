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
