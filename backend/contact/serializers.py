from rest_framework import serializers

from contact.models import Message


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "name", "email", "subject", "body", "created_at"]
        read_only_fields = ["id", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
