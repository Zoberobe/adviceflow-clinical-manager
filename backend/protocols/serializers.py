from rest_framework import serializers
from .models import Category, Protocol
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProtocolSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField(source='creator.username')
    delegated_to_name = serializers.ReadOnlyField(source='delegated_to.username')

    class Meta:
        model = Protocol
        fields = ['id', 'title', 'description', 'status', 'category', 'creator', 'creator_name', 'delegated_to', 'delegated_to_name', 'created_at', 'updated_at']
        read_only_fields = ['creator'] 