from rest_framework.serializers import ModelSerializer, ReadOnlyField
from .models import Profile, Address

class ProfileSerializer(ModelSerializer):
    address = ReadOnlyField(source='address.__str__')
    
    class Meta:
        model = Profile
        fields = '__all__'

class AddressSerializer(ModelSerializer):
    user = ReadOnlyField(source='user.email')
    
    class Meta:
        model = Address
        fields = '__all__' 