import pytest
from django.core import mail

from contact.models import Message


@pytest.mark.django_db
def test_public_can_submit_and_email_sent(api_client, settings):
    settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
    r = api_client.post(
        "/api/contact/",
        {"name": "A", "email": "a@x.com", "subject": "Hi", "body": "Hello"},
        format="json",
    )
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
