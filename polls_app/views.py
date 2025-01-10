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

logger = logging.getLogger(__name__)


class CreatePollView(APIView):
    def post(self, request):
        question = request.data.get("question")
        identifier = request.data.get("identifier")
        data = request.data.get("data")
        options = request.data.get("options", [])
        city_id = request.data.get("city_id")
        state_id = request.data.get("state_id")
        publication_date = request.data.get("publication_date")
        address_id = request.data.get("address_id")

        if not question or len(options) < 2:
            return Response(
                {"error": "A question and at least two options are required."},
                status=HTTP_400_BAD_REQUEST,
            )

        if not address_id:
            return Response(
                {"error": "Address ID is required."}, status=HTTP_400_BAD_REQUEST
            )

        # Get the address from the Address model
        try:
            address_obj = Address.objects.get(id=address_id)
        except Address.DoesNotExist:
            return Response(
                {"error": "Address not found."}, status=HTTP_400_BAD_REQUEST
            )

        full_address = f"{address_obj.street}, {address_obj.city}, {address_obj.state} {address_obj.zip_code}"

        # Geocode the address to get latitude and longitude
        geolocator = Nominatim(user_agent="geoapiExercises")
        location = geolocator.geocode(full_address)
        if not location:
            return Response(
                {"error": "Invalid address."},
                status=HTTP_400_BAD_REQUEST,
            )

        latitude = location.latitude
        longitude = location.longitude

        payload = {
            "question": question,
            "identifier": identifier,
            "data": data,
            "options": options,
            "latitude": latitude,
            "longitude": longitude,
        }
        api_url = "https://api.pollsapi.com/v1/create/poll"
        headers = {
            "Content-Type": "application/json",
            "api-key": settings.POLLS_API_KEY,
        }
        try:
            response = requests.post(api_url, json=payload, headers=headers)
            if response.status_code == 201:
                question = Question.objects.create(
                    question_text=question,
                    publication_date=publication_date,
                    city_id=city_id,
                    state_id=state_id,
                    longitude=longitude,
                    latitude=latitude,
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
            logger.error("Polls API request failed: %s", e)
            return Response(
                {"error": "An error occured connecting to Polls API."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )


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
        and saved back to the session. Returns the next question and its options in the response."""

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
