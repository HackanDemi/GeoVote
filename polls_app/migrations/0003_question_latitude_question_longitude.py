# Generated by Django 5.1.4 on 2025-01-08 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls_app', '0002_question_city_question_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
