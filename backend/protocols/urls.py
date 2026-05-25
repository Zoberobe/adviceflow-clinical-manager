from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProtocolViewSet, RegisterView, RandomPatientView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'protocols', ProtocolViewSet, basename='protocol')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('patients/random/', RandomPatientView.as_view(), name='random_patient'),
    path('', include(router.urls)),
]