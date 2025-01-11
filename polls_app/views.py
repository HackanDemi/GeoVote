import requests
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_404_NOT_FOUND,
)
from django.conf import settings
from .models import Question, Choice
from .serializer import PollSerializer
from geopy.geocoders import Nominatim
from profile_app.models import Address  # Imports the address class
import random
import googlemaps
import os
from dotenv import load_dotenv  # Loads environment variables from .env file
from django.utils import timezone

logger = logging.getLogger(__name__)

gmaps = googlemaps.Client(
    key=os.getenv("GOOGLE_MAPS_API_KEY")
)  # Initialized with the API key from the environment variables


class CreatePollView(APIView):
    def post(self, request):
        question = request.data.get("question")
        options = request.data.get("options", [])
        address_id = request.data.get("address_id")

        if not question or len(options) < 2:
            return Response(
                {"error": "A question and at least two options are required."},
                status=HTTP_400_BAD_REQUEST,
            )

        if not address_id:
            return Response(
                {"error": "Address is required."}, status=HTTP_400_BAD_REQUEST
            )

        geocode_result = gmaps.geocode(
            address_id
        )  # Sends a request to the Google Maps Geocoding API to get lat/lng of the address
        if not geocode_result:
            return Response(
                {"error": "Invalid address."},
                status=HTTP_400_BAD_REQUEST,
            )
        location = geocode_result[0]["geometry"]["location"]
        latitude = location["lat"]
        longitude = location["lng"]
        # Lat/lng are extracted from the response and included in the payload sent to the Polls API

        payload = {
            "question": question,
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
                publication_date = (
                    timezone.now()
                )  # Will set the publication_date to the user's current date/time in zulu time
                question = Question.objects.create(
                    question_text=question,
                    publication_date=publication_date,
                    latitude=latitude,
                    longitude=longitude,
                )
                for option in options:
                    Choice.objects.create(question=question, choice_test=option)
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
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AllPollsView(APIView):
    """To get the AllPollsView to cycle throught the
    questions follow the steps below:
    1. Store shown questions in the user's session
    2. Fetch a random poll that hasn't been shown yet
    3. Update the user's session with a new poll"""

    def get(self, request):
        api_url = f"https://api.pollsapi.com/v1/get/polls/"
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
                        {"error": "Failed to fetch polls."},
                        status=response.status_code,
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
            logger.error("Polls API request failed: {e}")
            return Response(
                {"error": "An error occured connecting to Polls API."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RandomPollView(APIView):
    def get(self, request):
        api_url = "https://api.pollsapi.com/v1/get/polls/"
        headers = {
            "api-key": settings.POLLS_API_KEY,
        }

        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()
            all_polls = response.json().get("data", {}).get("docs", [])

            if not all_polls:  # Checks for an empty list
                return Response({"error": "No polls available."}, status=HTTP_200_OK)

            random_poll = random.choice(
                all_polls
            )  # Selects a random poll from the list of polls
            poll_data = {  # Poll data is prepared in a dictionary format
                "id": random_poll.get("id"),
                "question_text": random_poll.get("question"),
                "options": [
                    option.get("text") for option in random_poll.get("options", [])
                ],
                "publication_date": random_poll.get("publication_date"),
                "latitude": random_poll.get("latitude"),
                "longitude": random_poll.get("longitude"),
            }
            return Response(poll_data, status=HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


class NextQuestionView(APIView):
    """Uses Django's session framework to keep track of the questions
    that have already been shown to the user. the shown_questions
    list is stored in the user's session."""

    def get(self, request):
        shown_questions = request.session.get("shown_questions", [])
        all_questions = list(Question.objects.exclude(id__in=shown_questions))

        if not all_questions:
            return Response(
                {"error": "No more questions available."}, status=HTTP_400_BAD_REQUEST
            )

        """Fetches a random question that hasn't been shown yet by 
        excluding the IDs in the shown_questions list"""
        next_question = random.choice(all_questions)
        shown_questions.append(next_question.id)
        request.session["shown_questions"] = shown_questions
        """The shown_questions list is updated with the new question's ID
        and saved back to the session. Returns the next question and its 
        options in the response."""

        return Response(
            {
                "question": next_question.question_text,
                "options": [
                    choice.choice_text for choice in next_question.choice_set.all()
                ],
            },
            status=HTTP_200_OK,
        )


# import profile model
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


class DeletePoll(APIView):
    def delete(self, request):
        poll_id = request.data.get("poll_id")

        if not poll_id:
            return Response(
                {"error": "Poll ID is required."},
                status=HTTP_400_BAD_REQUEST,
            )

        api_url = f"https://api.pollsapi.com/v1/remove/poll/"
        headers = {
            "Content-Type": "application/json",
            "api-key": settings.POLLS_API_KEY,
        }
        payload = {
            "poll_id": poll_id,
        }
        try:
            response = requests.post(api_url, json=payload, headers=headers)

            if response.status_code == 200:
                return Response(
                    {"message": "Poll deleted successfully."}, status=HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "error": "Failed to delete poll.",
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
