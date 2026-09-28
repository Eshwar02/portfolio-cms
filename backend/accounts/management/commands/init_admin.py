"""Create (or update) the CMS admin user from environment variables.

Used during deployment so the first superuser can be provisioned non-interactively:

    DJANGO_ADMIN_USERNAME, DJANGO_ADMIN_EMAIL, DJANGO_ADMIN_PASSWORD
"""
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update the admin superuser from environment variables."

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get("DJANGO_ADMIN_USERNAME")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD")
        email = os.environ.get("DJANGO_ADMIN_EMAIL", "")

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_ADMIN_USERNAME / DJANGO_ADMIN_PASSWORD not set; skipping."
                )
            )
            return

        user, created = User.objects.get_or_create(username=username)
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()
        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} admin user '{username}'."))
