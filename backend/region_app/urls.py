from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, StateViewSet, CityViewSet

router = DefaultRouter()
router.register(r"countries", CountryViewSet)
router.register(r"states", StateViewSet)
router.register(r"city", CityViewSet)

urlpatterns = [path("", include(router.urls))]
