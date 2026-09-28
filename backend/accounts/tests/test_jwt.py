import pytest


@pytest.mark.django_db
def test_login_returns_tokens(api_client, admin_user):
    r = api_client.post(
        "/api/auth/login",
        {"username": "admin", "password": "adminpass123"},
        format="json",
    )
    assert r.status_code == 200
    assert "access" in r.data and "refresh" in r.data


@pytest.mark.django_db
def test_login_bad_password(api_client, admin_user):
    r = api_client.post(
        "/api/auth/login",
        {"username": "admin", "password": "wrong"},
        format="json",
    )
    assert r.status_code == 401


@pytest.mark.django_db
def test_refresh_returns_access(api_client, admin_user):
    login = api_client.post(
        "/api/auth/login",
        {"username": "admin", "password": "adminpass123"},
        format="json",
    )
    r = api_client.post(
        "/api/auth/refresh",
        {"refresh": login.data["refresh"]},
        format="json",
    )
    assert r.status_code == 200 and "access" in r.data
