from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR

from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import User
from django.db import IntegrityError

# TokenReq class to check if the user is authenticated
class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# Create your views here.
class SignUp(APIView):
    
    # Creating a new user with the given data
    def post(self, request):
        body_data = request.data.copy()
        # Setting the username as the email
        body_data['username'] = body_data['email']
        
        # Creating a new user with the given data
        try:
            # Creating a new user and a token for the user
            new_user = User.objects.create_user(**body_data)
            token = Token.objects.create(user=new_user)            
            return Response({'user' : new_user.email, 'token' : token.key})
        except ValueError as e:
            return Response(f"Value error: {e}", status=HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            return Response(f"Integrity error: {e}", status=HTTP_400_BAD_REQUEST)
    
       
    
class LogIn(APIView):
    
    # Authenticating the user with the given credentials
    def post(self, request):
        # Copying the request data and getting the email and password
        body_data = request.data.copy()
        # Setting the username as the email
        email = body_data.get('email')
        # Getting the password
        password = body_data.get('password')
        try:
            # Authenticating the user with the given credentials
            user = authenticate(username=email, password=password)
            # If the user is authenticated, log in the user and return the token
            login(request, user)
            # Creating a token for the user
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token' : token.key, 'user' : user.email})
        except Exception:
            return Response("No user matching credentials", status=HTTP_404_NOT_FOUND)

class LogOut(TokenReq):
    
    # Logging out the user and deleting the token
    def post(self, request):
        try:
            # Deleting the token and logging out the user
            request.user.auth_token.delete()
            # Logging out the user
            logout(request)
            return Response(status=HTTP_204_NO_CONTENT)
        # Handling exceptions and returning an error response
        except Token.DoesNotExist:
            return Response({'error': 'Token not found'}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
