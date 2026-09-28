from django.contrib import admin

from content.models import (
    Profile, Project, Skill, Experience, Education,
    Service, Testimonial, Blog, SocialLink,
)

for _model in (
    Profile, Project, Skill, Experience, Education,
    Service, Testimonial, Blog, SocialLink,
):
    admin.site.register(_model)
