from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from profile_app.models import Address
from polls_app.models import Question, Choice
from user_app.models import User  # Import the correct User model
import json
from datetime import datetime
from django.utils import timezone


class CreatePollViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("create_poll")
        self.user = User.objects.create_user(username="testuser", password="12345")
        self.address = Address.objects.create(
            user=self.user,
            street="1600 Amphitheatre Parkway",
            city="Mountain View",
            state="CA",
            zip_code="94043",
        )
        self.valid_payload = {
            "question": "What is your favorite programming language?",
            "identifier": "user_123",
            "data": {"category": "preferences"},
            "options": [
                {"text": "Python"},
                {"text": "JavaScript"},
                {"text": "Java"},
                {"text": "C++"},
            ],
            "city_id": 1,
            "state_id": 1,
            "publication_date": "2026-12-31T12:00:00Z",
            "address_id": self.address.id,
        }

    def test_create_poll_valid_payload(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        if response.status_code not in [status.HTTP_200_OK, status.HTTP_201_CREATED]:
            print("Response content:", response.content)
        self.assertIn(
            response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED]
        )

    def test_create_poll_invalid_payload(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload["question"] = ""
        response = self.client.post(
            self.url, data=json.dumps(invalid_payload), content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AllPollsViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("all_polls")

    def test_get_all_polls(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class NextQuestionViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("next_question")
        self.question1 = Question.objects.create(
            question_text="Question 1", publication_date=timezone.now()
        )
        self.question2 = Question.objects.create(
            question_text="Question 2", publication_date=timezone.now()
        )
        self.question3 = Question.objects.create(
            question_text="Question 3", publication_date=timezone.now()
        )

    def test_get_next_question(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("question", response.json())

    def test_get_next_question_no_more_questions(self):
        session = self.client.session
        session["shown_questions"] = [
            self.question1.id,
            self.question2.id,
            self.question3.id,
        ]
        session.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "No more questions available."})
