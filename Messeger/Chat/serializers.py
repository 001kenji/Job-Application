from django.contrib.auth import get_user_model

from rest_framework import serializers
from .models import AccountManager
User = get_user_model()
import datetime

class UserCreateSerializer(UserCreateSerializer):
    class Meta (UserCreateSerializer.Meta):
        model = User
        fields = (
            'id','email',
            'is_active',
            'name','password',            
            )

            


class UserSerializer(serializers.ModelSerializer):
    #including an extra external field
    # 
    class Meta:
        model = User
        
        fields = ( 
            'name','is_staff','email','id','ProfilePic','about','rattings','JobsHistory','requestedJobs')
