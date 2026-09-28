import pytest
from django.core.files.uploadedfile import SimpleUploadedFile


@pytest.mark.django_db
def test_admin_upload_ok(auth_client, tmp_path, settings):
    settings.MEDIA_ROOT = tmp_path
    f = SimpleUploadedFile(
        "a.png", b"\x89PNG\r\n\x1a\n" + b"0" * 10, content_type="image/png"
    )
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
