from rest_framework import viewsets, permissions, generics
from .models import Category, Protocol
from .serializers import CategorySerializer, ProtocolSerializer, UserSerializer
from django.db.models import Q
from django.contrib.auth.models import User 

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated] 

class ProtocolViewSet(viewsets.ModelViewSet):
    serializer_class = ProtocolSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Protocol.objects.filter(Q(creator=user) | Q(delegated_to=user))

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] 
    serializer_class = UserSerializer