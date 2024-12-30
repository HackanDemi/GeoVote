# from django.urls import path
# from . import views

# app_name = "polls_app"
# urlpatterns = [
#     path("", views.index, name="index"),
#     path("<int:question_id>/", views.detail, name="detail"),
#     path("<int:question_id>/results/", views.results, name="results"),
# ]

from django.urls import path
from .views import CreatePollView

urlpatterns = [
    path("create-poll/", CreatePollView.as_view(), name="create_poll"),
]
