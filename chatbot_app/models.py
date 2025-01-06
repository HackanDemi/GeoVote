from django.db import models


class ChatHistory(models.Model):
    user_question = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Question: {self.user_question} | Response: {self.bot_response}"
