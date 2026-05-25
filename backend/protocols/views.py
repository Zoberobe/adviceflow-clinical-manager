from rest_framework import viewsets, permissions, generics
from .models import Category, Protocol
from .serializers import CategorySerializer, ProtocolSerializer, UserSerializer
from django.db.models import Q
from django.contrib.auth.models import User 
from rest_framework.views import APIView
from rest_framework.response import Response
import urllib.request
import json

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

class RandomPatientView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            url = "https://randomuser.me/api/?inc=name,dob,picture&nat=br"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                user_data = data['results'][0]
                
                patient = {
                    "full_name": f"{user_data['name']['first']} {user_data['name']['last']}",
                    "age": user_data['dob']['age'],
                    "photo_url": user_data['picture']['thumbnail'],
                    "clinical_status": "Aguardando Triagem" 
                }
                
                return Response(patient)
                
        except Exception as e:
            return Response({"error": "Sistema de simulação indisponível no momento."}, status=503)

class ProtocolViewSet(viewsets.ModelViewSet):
    serializer_class = ProtocolSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    filterset_fields = {
        'status': ['exact'],
        'category': ['exact'],
        'delegated_to': ['exact'],
        'created_at': ['exact', 'date'], 
        'updated_at': ['exact', 'date'],
    }

    def get_queryset(self):
        user = self.request.user
        return Protocol.objects.filter(Q(creator=user) | Q(delegated_to=user))

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)