from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from .models import Profile, Address
from .serializers import ProfileSerializer, AddressSerializer
from user_app.serializers import UserSerializer
from django.contrib.auth import get_user_model
import googlemaps
from datetime import datetime
import os
from dotenv import load_dotenv

# Create your views here.

load_dotenv()

User = get_user_model()

gmaps = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            address = profile.address
            profile_serializer = ProfileSerializer(profile)
            address_serializer = AddressSerializer(address) if address else None

            full_address = ''
            if address:
                full_address = f"{address.street}, {address.city}, {address.state} {address.zip_code}"

            latitude = longitude = None
            if full_address:
                geocode_result = gmaps.geocode(full_address)
                if geocode_result:
                    latitude = geocode_result[0]['geometry']['location']['lat']
                    longitude = geocode_result[0]['geometry']['location']['lng']

            coordinates = {
                "latitude": latitude,
                "longitude": longitude
            }

            user_data = {
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "email": request.user.email,
            }

            return Response({
                "user": user_data,
                "profile": profile_serializer.data,
                "address": address_serializer.data if address_serializer else None,
                "coordinates": coordinates
            }, status=HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=HTTP_404_NOT_FOUND)
    
    def post(self, request):
        profile_data = request.data.get("profile")
        address_data = request.data.get("address")
    
        profile_serializer = ProfileSerializer(data=profile_data)
        address_serializer = AddressSerializer(data=address_data)
    
        if profile_serializer.is_valid() and address_serializer.is_valid():
            address_instance = address_serializer.save(user=request.user)
            
            full_address = f"{address_instance.street}, {address_instance.city}, {address_instance.state} {address_instance.zip_code}"
            geocode_result = gmaps.geocode(full_address)
            if geocode_result:
                latitude = geocode_result[0]['geometry']['location']['lat']
                longitude = geocode_result[0]['geometry']['location']['lng']
                print(f"Latitude: {latitude}, Longitude: {longitude}")
            
            profile_instance = profile_serializer.save(user=request.user, address=address_instance)
            
            return Response({
                "profile": profile_serializer.data,
                "address": AddressSerializer(address_instance).data,
                "coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                }
            }, status=HTTP_201_CREATED)
    
        profile_errors = profile_serializer.errors if not profile_serializer.is_valid() else {}
        address_errors = address_serializer.errors if not address_serializer.is_valid() else {}
    
        return Response({
            "profile_errors": profile_errors,
            "address_errors": address_errors
        }, status=HTTP_400_BAD_REQUEST)
        
    
    def put(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            address = profile.address
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=HTTP_404_NOT_FOUND)

        profile_data = request.data.get("profile")
        address_data = request.data.get("address")
        user_data = request.data.get("user")

        profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
        address_serializer = AddressSerializer(address, data=address_data, partial=True) if address_data else None
        user_serializer = UserSerializer(request.user, data=user_data, partial=True)

        if profile_serializer.is_valid() and (address_serializer is None or address_serializer.is_valid()) and user_serializer.is_valid():
            if address_serializer:
                address_instance = address_serializer.save(user=request.user)
                profile_instance = profile_serializer.save(address=address_instance)

                full_address = f"{address_instance.street}, {address_instance.city}, {address_instance.state} {address_instance.zip_code}"
                geocode_result = gmaps.geocode(full_address)
                if geocode_result:
                    latitude = geocode_result[0]['geometry']['location']['lat']
                    longitude = geocode_result[0]['geometry']['location']['lng']
            else:
                profile_instance = profile_serializer.save()
                latitude = None
                longitude = None

            user_instance = user_serializer.save()

            return Response({
                "user": UserSerializer(user_instance).data,
                "profile": ProfileSerializer(profile_instance).data,  # Ensure profile_instance is used here
                "address": AddressSerializer(address_instance if address_serializer else address).data if address else None,
                "coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                }
            }, status=HTTP_200_OK)

        profile_errors = profile_serializer.errors if not profile_serializer.is_valid() else {}
        address_errors = address_serializer.errors if address_serializer and not address_serializer.is_valid() else {}
        user_errors = user_serializer.errors if not user_serializer.is_valid() else {}

        return Response({
            "profile_errors": profile_errors,
            "address_errors": address_errors,
            "user_errors": user_errors
        }, status=HTTP_400_BAD_REQUEST)