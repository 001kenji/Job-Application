from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
#
from django.contrib.auth.hashers import check_password
from datetime import datetime
from django.contrib.auth import logout


class CustomAuthBackend(BaseBackend):
    def authenticate(self, request,email=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

        

        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
