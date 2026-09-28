from rest_framework import serializers

from content.models import (
    Profile, Project, Skill, Experience, Education,
    Service, Testimonial, Blog, SocialLink,
)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


def _meta(model_cls):
    return type("Meta", (), {"model": model_cls, "fields": "__all__"})


class SkillSerializer(serializers.ModelSerializer):
    Meta = _meta(Skill)


class ExperienceSerializer(serializers.ModelSerializer):
    Meta = _meta(Experience)


class EducationSerializer(serializers.ModelSerializer):
    Meta = _meta(Education)


class ServiceSerializer(serializers.ModelSerializer):
    Meta = _meta(Service)


class TestimonialSerializer(serializers.ModelSerializer):
    Meta = _meta(Testimonial)


class BlogSerializer(serializers.ModelSerializer):
    Meta = _meta(Blog)


class SocialLinkSerializer(serializers.ModelSerializer):
    Meta = _meta(SocialLink)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
