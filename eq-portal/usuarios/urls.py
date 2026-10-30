from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdministradorViewSet, EditorViewSet

router = DefaultRouter()
router.register(r'administradores', AdministradorViewSet)
router.register(r'editores', EditorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]