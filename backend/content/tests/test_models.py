import pytest

from content.models import Project


@pytest.mark.django_db
def test_project_defaults():
    p = Project.objects.create(title="X", slug="x")
    assert p.status == "draft"
    assert p.display_order == 0
    assert p.created_at is not None
