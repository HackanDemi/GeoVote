import requests
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from django.conf import settings

logger = logging.getLogger(__name__)


class CreatePollView(APIView):
    def post(self, request):
        question = request.data.get("question")
        identifier = request.data.get("identifier")
        data = request.data.get("data")
        options = request.data.get("options", [])

        if not question or len(options) < 2:
            return Response(
                {"error": "A question and at least two options are required."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
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


class AllPollsView(APIView):
    def get(self, request):
        try:
            offset = int(request.query_params.get("offset", 0))
            limit = int(request.query_params.get("limit", 25))
        except ValueError:
            return Response(
                {"error": "Invalid 'offset' or 'limit' value."},
                status=HTTP_400_BAD_REQUEST,
            )

        api_url = f"https://api.pollsapi.com/v1/get/polls?offset={offset}&limit={limit}"
        headers = {
            "api-key": settings.POLLS_API_KEY,
        }

        try:
            response = requests.get(api_url, headers=headers)
            if response.status_code == 200:
                try:
                    return Response(response.json(), status=HTTP_200_OK)
                except ValueError:
                    return Response(
                        {"error": "Invalid response from Polls API."},
                        status=HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                try:
                    error_details = response.json()
                except ValueError:
                    error_details = {"error": "Invalid response from Polls API."}
                return Response(
                    {
                        "error": "Failed to fetch polls.",
                        "details": error_details,
                    },
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            logger.error("Polls API request failed: %s", e)
            return Response(
                {"error": "An error occured connecting to Polls API."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )


# 67731a341cc54200101734eb test poll_id
class GetAllVotes(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get("poll_id")
            offset = int(request.query_params.get("offset", 0))
            limit = min(request.query_params.get("limit", 25))
        except ValueError:
            return Response(
                {"error": "Invalid 'offset' or 'limit' value."},
                status=HTTP_400_BAD_REQUEST,
            )

        api_url = f"https://api.pollsapi.com/v1/get/votes/{poll_id}?offset={offset}&limit={limit}"
        headers = {
            "api-key": settings.POLLS_API_KEY,
        }

        try:
            response = requests.get(api_url, headers=headers)
            if response.status_code == 200:
                try:
                    return Response(response.json(), status=HTTP_200_OK)
                except ValueError:
                    return Response(
                        {"error": "Invalid response from Polls API."},
                        status=HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                try:
                    error_details = response.json()
                except ValueError:
                    error_details = {"error": "Invalid response from Polls API."}
                return Response(
                    {
                        "error": "Failed to fetch polls.",
                        "details": error_details,
                    },
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "An error occured connecting to Polls API."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )
