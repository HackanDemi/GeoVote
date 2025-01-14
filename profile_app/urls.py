from django.urls import path
from .views import ProfileView


urlpatterns = [
    path("", ProfileView.as_view(), name="profile"),
    path("<int:pk>/", ProfileView.as_view(), name="profile"),
]