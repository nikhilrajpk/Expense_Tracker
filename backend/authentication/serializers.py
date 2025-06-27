from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
# import re

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(
        required=True, 
        validators=[
            RegexValidator(regex=r'^[a-zA-Z0-9][a-zA-Z0-9_]+$', message="Username should only contain alphanumeric with underscore"),
            UniqueValidator(queryset=User.objects.all(), message="This username already exists.")        
        ]
    )
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="This email already exists.")
        ]
    )
 
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password":"Password do not match."})
        return attrs
    
    # def validate_username(self, value):
    #     username_pattern = r'^[a-zA-Z0-9][a-zA-Z0-9_]+$'
        
    #     if not re.match(username_pattern, value):
    #         raise serializers.ValidationError({"Username":"Username should only contain alphanumeric with underscore"})
        
    #     return value
    
    def create(self, validated_data):
        confirm_password = validated_data.pop('confirm_password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        ) 
        return user
    