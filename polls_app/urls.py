from django.urls import path
from .views import CreatePollView

urlpatterns = [
    path("create-poll/", CreatePollView.as_view(), name="create_poll"),
]
