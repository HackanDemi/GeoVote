from rest_framework.serializers import ModelSerializer
from .models import Poll, Choice


class PollSerializer(ModelSerializer):
    class Meta:
        model = Poll
        fields = "__all__"


class ChoiceSerializer(ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"
