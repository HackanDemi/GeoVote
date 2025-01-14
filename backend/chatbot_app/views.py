from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from openai import OpenAI
from django.conf import settings
import requests
from django.conf import settings
from .models import ChatHistory


class ChatbotView(APIView):
    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response(
                {"error": "A question is required."}, status=HTTP_400_BAD_REQUEST
            )

        api_url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        }
        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": question},
            ],
            "max_tokens": 150,
            "temperature": 0.7,
            "n": 1,
        }

        try:
            response = requests.post(api_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            answer = data["choices"][0]["message"]["content"].strip()

            ChatHistory.objects.create(user_question=question, bot_response=answer)

            return Response({"response": answer}, status=HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
