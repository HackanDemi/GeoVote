import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from django.conf import settings


class CreatePollView(APIView):
    def post(self, request):
        question = request.data.get("question")
        identifier = request.data.get("identifier")
        data = request.data.get("data")
        options = request.data.get("options", [])

        if not question or len(options) < 2:
            return Response(
                {"error": "A question and at least two options are required."},
                status=HTTP_400_BAD_REQUEST,
            )
        payload = {
            "question": question,
            "identifier": identifier,
            "data": data,
            "options": options,
        }
        api_url = "https://api.pollsapi.com/v1/create/poll"
        headers = {
            "Content-Type": "application/json",
            # todo: put api key in .gitignore and put into settings
            "api-key": settings.POLLS_API_KEY,
        }
        try:
            response = requests.post(api_url, json=payload, headers=headers)

            if response.status_code == 201:
                return Response(response.json(), status=HTTP_201_CREATED)
            else:
                return Response(
                    {
                        "error": "Failed to create poll.",
                        "details": response.json(),
                    },
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {
                    "error": str(e),
                },
                status=HTTP_400_BAD_REQUEST,
            )
