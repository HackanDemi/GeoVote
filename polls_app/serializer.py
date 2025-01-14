from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Question, Choice


class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = "__all__"
