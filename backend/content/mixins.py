class PublishedQuerysetMixin:
    """Restrict list/detail to published rows for non-staff requests."""

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user and user.is_authenticated and user.is_staff):
            return qs.filter(status="published")
        return qs
