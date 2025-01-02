from rest_framework.serializers import ModelSerializer
from .models import Profile, Address

class ProfileSerializer(ModelSerializer):
    
    class Meta:
        model = Profile
        fields = '__all__'

class AddressSerializer(ModelSerializer):
    
    class Meta:
        model = Address
        fields = '__all__' 