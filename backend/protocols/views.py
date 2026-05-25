from rest_framework import viewsets, permissions
from .models import Category, Protocol
from .serializers import CategorySerializer, ProtocolSerializer
from django.db.models import Q

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