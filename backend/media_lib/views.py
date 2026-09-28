from rest_framework import generics

from media_lib.models import Media
from media_lib.serializers import MediaSerializer


class MediaUploadView(generics.CreateAPIView):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
