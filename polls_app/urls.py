from django.urls import path
from .views import CreatePollView, AllPollsView, GetAllVotes

urlpatterns = [
    path("create-poll/", CreatePollView.as_view(), name="create_poll"),
    path("all/", AllPollsView.as_view(), name="all_polls"),
    path("votes/", GetAllVotes.as_view(), name="get_all_votes"),
]
