from django.urls import path
from rest_framework.routers import DefaultRouter

from content.views import (
    ProjectViewSet, SkillViewSet, ExperienceViewSet, EducationViewSet,
    ServiceViewSet, TestimonialViewSet, BlogViewSet, SocialLinkViewSet,
    ProfileView,
)

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("skills", SkillViewSet, basename="skill")
router.register("experience", ExperienceViewSet, basename="experience")
router.register("education", EducationViewSet, basename="education")
router.register("services", ServiceViewSet, basename="service")
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("blogs", BlogViewSet, basename="blog")
router.register("social-links", SocialLinkViewSet, basename="social-link")

urlpatterns = [path("profile/", ProfileView.as_view(), name="profile")] + router.urls
