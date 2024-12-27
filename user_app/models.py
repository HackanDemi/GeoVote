from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.
# class User(AbstractUser):
#     email = models.EmailField(unique=True, blank=False)

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = []


class User(AbstractUser):
    groups = models.ManyToManyField(
        Group, related_name="custom_user_set", blank=True  # Change to a unique name
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",  # Change to a unique name
        blank=True,
    )
