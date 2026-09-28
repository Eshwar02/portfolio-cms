from django.urls import path
from rest_framework.routers import DefaultRouter

from contact.views import ContactCreateView, MessageViewSet

router = DefaultRouter()
router.register("messages", MessageViewSet, basename="message")

urlpatterns = [path("contact/", ContactCreateView.as_view(), name="contact")] + router.urls
