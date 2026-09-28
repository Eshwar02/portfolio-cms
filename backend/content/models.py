from django.db import models

STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]


class ContentBase(models.Model):
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["display_order", "-created_at"]


class Profile(models.Model):
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    resume = models.FileField(upload_to="resume/", blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Project(ContentBase):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Skill(ContentBase):
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=120, blank=True)
    proficiency = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Experience(ContentBase):
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.position} @ {self.company}"


class Education(ContentBase):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    year = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.degree} — {self.institution}"


class Service(ContentBase):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.title


class Testimonial(ContentBase):
    author = models.CharField(max_length=200)
    role = models.CharField(max_length=200, blank=True)
    quote = models.TextField()
    avatar = models.ImageField(upload_to="testimonials/", blank=True, null=True)

    def __str__(self):
        return self.author


class Blog(ContentBase):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title


class SocialLink(models.Model):
    platform = models.CharField(max_length=100)
    url = models.URLField()
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return self.platform
