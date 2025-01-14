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
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.conf import settings
from .models import Question, Choice, Vote
from .serializer import PollSerializer
from geopy.geocoders import Nominatim
from profile_app.models import Address  # Imports the address class
import random
import googlemaps
import os
from dotenv import load_dotenv  # Loads environment variables from .env file
from django.utils import timezone
from django.db.models import Count

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
            if response.status_code in [HTTP_200_OK, HTTP_201_CREATED]:
                publication_date = (
                    timezone.now()
                )  # Will set the publication_date to the user's current date/time in zulu time
                poll_data = response.json().get("data", {})
                question = Question.objects.create(
                    question_text=poll_data.get("question"),  # Changed from "question"
                    publication_date=publication_date,
                    latitude=latitude,
                    longitude=longitude,
                )
                for option in poll_data.get("options", []):
                    Choice.objects.create(
                        question=question, choice_text=option.get("text")
                    )
                return Response(poll_data, status=HTTP_201_CREATED)
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

class CustomTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        logger.info(f"Token: {request.headers.get('Authorization')}")
        return super().authenticate(request)
    
class AllPollsView(APIView):
    """To get the AllPollsView to cycle throught the
    questions follow the steps below:
    1. Store shown questions in the user's session
    2. Fetch a random poll that hasn't been shown yet
    3. Update the user's session with a new poll"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        logger.info(f"User: {request.user}, Permissions: {request.user.get_all_permissions()}")
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
            logger.error(f"Polls API request failed: {e}")
            return Response(
                {"error": "An error occurred connecting to Polls API."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,)
            


class UserPollsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"User: {request.user}, Permissions: {request.user.get_all_permissions()}")
        try:
            polls = Question.objects.filter(user=request.user)
            logger.info(f"Polls found: {polls}")
            serializer = PollSerializer(polls, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching polls: {e}")
            return Response({"error": "An error occurred fetching polls."}, status=HTTP_500_INTERNAL_SERVER_ERROR)



class RandomPollView(APIView):
    def get(self, request):
        questions = Question.objects.all()
        if not questions:
            return Response({"error": "No polls available."}, status=HTTP_200_OK)

        random_poll = random.choice(questions)
        options = [
            {"id": choice.id, "text": choice.choice_text}
            for choice in random_poll.choice_set.all()
        ]

        poll_data = {
            "id": str(random_poll.id),
            "question_text": random_poll.question_text,
            "options": options,
            "publication_date": random_poll.publication_date,
            "latitude": random_poll.latitude,
            "longitude": random_poll.longitude,
        }
        return Response(poll_data, HTTP_200_OK)


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
    def get(self, request, question_id):
        votes = (
            Vote.objects.filter(question_id=question_id)
            .values("choice__choice_text")
            .annotate(total_votes=Count("id"))
        )
        results = [
            {
                "choice_text": vote["choice__choice_text"],
                "total_votes": vote["total_votes"],
            }
            for vote in votes
        ]
        return Response(
            {"question_id": question_id, "results": results}, status=HTTP_200_OK
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


class VoteOnChoice(APIView):
    def post(self, request):
        question_id = request.data.get("question_id")
        choice_id = request.data.get("choice_id")

        if not question_id or not choice_id:
            return Response(
                {"error": "A question_id and choice_id are required."},
                HTTP_400_BAD_REQUEST,
            )

        try:
            question = Question.objects.get(id=question_id)
            choice = Choice.objects.get(id=choice_id, question=question)
        except (Question.DoesNotExist, Choice.DoesNotExist):
            return Response(
                {"error": "Invalid question or choice ID."}, status=HTTP_404_NOT_FOUND
            )

        Vote.objects.create(choice=choice, question=question)
        return Response({"message": "Vote recorded."}, status=HTTP_201_CREATED)
