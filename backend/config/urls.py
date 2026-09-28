from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.db import connection
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health(_request):
    """Liveness + DB connectivity check for deploy platforms."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False
    return JsonResponse(
        {"status": "ok" if db_ok else "degraded", "database": db_ok},
        status=200 if db_ok else 503,
    )


urlpatterns = [
    path("api/health/", health, name="health"),
    path("django-admin/", admin.site.urls),
    path("api/auth/login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path("api/", include("content.urls")),
    path("api/", include("media_lib.urls")),
    path("api/", include("contact.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
