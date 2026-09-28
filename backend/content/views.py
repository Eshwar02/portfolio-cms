from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from content.mixins import PublishedQuerysetMixin
from content.models import (
    Profile, Project, Skill, Experience, Education,
    Service, Testimonial, Blog, SocialLink,
)
from content.serializers import (
    ProfileSerializer, ProjectSerializer, SkillSerializer, ExperienceSerializer,
    EducationSerializer, ServiceSerializer, TestimonialSerializer,
    BlogSerializer, SocialLinkSerializer,
)


class ProjectViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "slug"


class SkillViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class ExperienceViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class EducationViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


class ServiceViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class TestimonialViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class BlogViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = "slug"


class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer


class ProfileView(APIView):
    def get(self, request):
        obj = Profile.objects.first()
        return Response(ProfileSerializer(obj).data if obj else {})

    def put(self, request):
        obj = Profile.objects.first()
        ser = (
            ProfileSerializer(obj, data=request.data)
            if obj
            else ProfileSerializer(data=request.data)
        )
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)
