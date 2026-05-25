from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProtocolViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'protocols', ProtocolViewSet, basename='protocol')

urlpatterns = [
    path('', include(router.urls)),
]