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
from django.contrib.auth import get_user_model

# Create your views here.


User = get_user_model()

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request, pk=None):
        print(f"Authenticated user: {request.user}")
        try:
            if pk:
                profile = Profile.objects.get(pk=pk, user=request.user)
                address = Address.objects.get(pk=profile.address.pk, user=request.user)
            else:
                profile = Profile.objects.get(user=request.user)
                address = Address.objects.get(user=request.user)
            profile_serializer = ProfileSerializer(profile)
            address_serializer = AddressSerializer(address)
            return Response({
                "profile": profile_serializer.data,
                "address": address_serializer.data
            }, status=HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=HTTP_404_NOT_FOUND)
    
    def post(self, request):
        print(f"Authenticated user: {request.user}")  # Debug statement
        profile_data = request.data.get("profile")
        address_data = request.data.get("address")
    
        profile_serializer = ProfileSerializer(data=profile_data)
        address_serializer = AddressSerializer(data=address_data)
    
        if profile_serializer.is_valid() and address_serializer.is_valid():
            
            address_instance = address_serializer.save(user=request.user)
            profile_instance = profile_serializer.save(user=request.user, address=address_instance)
            
            return Response({
                "profile": profile_serializer.data,
                "address": AddressSerializer(Address.objects.get(user=request.user)).data
            }, status=HTTP_201_CREATED)
    
        profile_errors = profile_serializer.errors if not profile_serializer.is_valid() else {}
        address_errors = address_serializer.errors if not address_serializer.is_valid() else {}
    
        return Response({
            "profile_errors": profile_errors,
            "address_errors": address_errors
        }, status=HTTP_400_BAD_REQUEST)
        
    
    def put(self, request, pk=None):
        print(f"Authenticated user: {request.user}")  # Debug statement
        try:
            profile = Profile.objects.get(pk=pk, user=request.user)
            address = Address.objects.get(pk=profile.address.pk, user=request.user)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=HTTP_404_NOT_FOUND)
    
        profile_data = request.data.get("profile")
        address_data = request.data.get("address")
    
        profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
        address_serializer = AddressSerializer(address, data=address_data, partial=True) if address_data else None
    
        if profile_serializer.is_valid() and (address_serializer is None or address_serializer.is_valid()):
            profile_serializer.save()
            if address_serializer:
                address_serializer.save()
            return Response({
                "profile": ProfileSerializer(profile).data,  # Ensure profile is serialized with updated address
                "address": AddressSerializer(address).data
            }, status=HTTP_200_OK)
    
        # Debug statements to log errors
        print(f"Profile errors: {profile_serializer.errors}")
        if address_serializer:
            print(f"Address errors: {address_serializer.errors}")
    
        profile_errors = profile_serializer.errors if not profile_serializer.is_valid() else {}
        address_errors = address_serializer.errors if address_serializer and not address_serializer.is_valid() else {}
    
        return Response({
            "profile_errors": profile_errors,
            "address_errors": address_errors
        }, status=HTTP_400_BAD_REQUEST)