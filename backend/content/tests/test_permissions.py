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
