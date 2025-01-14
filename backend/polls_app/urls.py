from django.urls import path
from .views import (
    CreatePollView,
    AllPollsView,
    UserPollsView,
    GetAllVotes,
    DeletePoll,
    NextQuestionView,
    RandomPollView,
    VoteOnChoice,
)

urlpatterns = [
    path("create-poll/", CreatePollView.as_view(), name="create_poll"),
    path("all/", AllPollsView.as_view(), name="all_polls"),
    path("user-polls/", UserPollsView.as_view(), name="user_polls"),
    path("random/", RandomPollView.as_view(), name="random_poll"),
    path("polls/next", NextQuestionView.as_view(), name="next_question"),
    path("votes/<int:question_id>/", GetAllVotes.as_view(), name="get_all_votes"),
    path("delete/", DeletePoll.as_view(), name="delete_poll"),
    path("vote-on-choice/", VoteOnChoice.as_view(), name="vote_on_choice"),
]
