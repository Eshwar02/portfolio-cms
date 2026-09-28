from django.db import models


class Media(models.Model):
    file = models.FileField(upload_to="uploads/")
    alt_text = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
