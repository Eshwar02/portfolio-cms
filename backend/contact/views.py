from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, viewsets, permissions
from rest_framework.permissions import AllowAny

from contact.models import Message
from contact.serializers import ContactSerializer, MessageSerializer


class ContactCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        msg = serializer.save()
        send_mail(
            subject=f"[Portfolio] {msg.subject or 'New message'} from {msg.name}",
            message=msg.body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_RECIPIENT],
            fail_silently=True,
        )


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["get", "patch", "delete"]
