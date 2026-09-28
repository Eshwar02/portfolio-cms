from rest_framework import serializers

from media_lib.models import Media

ALLOWED = {"jpg", "jpeg", "png", "gif", "webp", "svg", "pdf"}
MAX_BYTES = 5 * 1024 * 1024


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "file", "alt_text", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

    def validate_file(self, f):
        ext = f.name.rsplit(".", 1)[-1].lower() if "." in f.name else ""
        if ext not in ALLOWED:
            raise serializers.ValidationError(f"Extension .{ext} not allowed")
        if f.size > MAX_BYTES:
            raise serializers.ValidationError("File exceeds 5 MB limit")
        return f
