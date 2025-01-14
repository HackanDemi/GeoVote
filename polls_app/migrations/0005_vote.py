# Generated by Django 5.1.4 on 2025-01-13 22:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls_app', '0004_remove_question_city_remove_question_state_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('choice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls_app.choice')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls_app.question')),
            ],
        ),
    ]
