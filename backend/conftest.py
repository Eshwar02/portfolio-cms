import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        username="admin",
        password="adminpass123",
        is_staff=True,
        email="admin@x.com",
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(admin_user):
    client = APIClient()
    token = RefreshToken.for_user(admin_user).access_token
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client
