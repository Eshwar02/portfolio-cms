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
    r = auth_client.post(
        "/api/skills/", {"name": "Python", "status": "published"}, format="json"
    )
    assert r.status_code == 201


@pytest.mark.django_db
def test_experience_requires_dates(auth_client):
    r = auth_client.post(
        "/api/experience/",
        {"company": "Acme", "position": "Dev", "start_date": "2020-01-01", "status": "published"},
        format="json",
    )
    assert r.status_code == 201
