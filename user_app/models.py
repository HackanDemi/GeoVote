from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    



