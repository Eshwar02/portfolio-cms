from django.urls import path

from media_lib.views import MediaUploadView

urlpatterns = [path("upload/", MediaUploadView.as_view(), name="upload")]
