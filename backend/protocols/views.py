from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User 
from .models import Category, Protocol
from .serializers import CategorySerializer, ProtocolSerializer, UserSerializer
from .permissions import IsCreatorOrReadOnly

from .services import PatientService 

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated] 

class ProtocolViewSet(viewsets.ModelViewSet):
    serializer_class = ProtocolSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly] 
    
    filterset_fields = {
        'status': ['exact'],
        'category': ['exact'],
        'delegated_to': ['exact'],
        'created_at': ['exact', 'date'], 
        'updated_at': ['exact', 'date'],
    }

    def get_queryset(self):
        user = self.request.user
        return Protocol.objects.filter(
            Q(creator=user) | Q(delegated_to=user)
        ).select_related('creator', 'delegated_to', 'category')

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] 
    serializer_class = UserSerializer

class RandomPatientView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            patient = PatientService.get_random_patient()
            return Response(patient)
                
        except Exception as e:
            return Response({"error": "Sistema de simulação indisponível no momento."}, status=503)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer 
    permission_classes = [permissions.IsAuthenticated]