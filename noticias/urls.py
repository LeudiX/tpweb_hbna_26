from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticiaViewSet, EventoViewSet

router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet, basename='noticias')
router.register(r'eventos', EventoViewSet, basename='eventos')

urlpatterns = [
    path('', include(router.urls)),
]