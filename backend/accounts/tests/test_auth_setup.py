import pytest


@pytest.mark.django_db
def test_admin_fixture_is_staff(admin_user):
    assert admin_user.is_staff is True
