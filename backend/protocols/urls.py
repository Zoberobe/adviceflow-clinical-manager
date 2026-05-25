from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProtocolViewSet, RegisterView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'protocols', ProtocolViewSet, basename='protocol')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), 
    path('', include(router.urls)),
]