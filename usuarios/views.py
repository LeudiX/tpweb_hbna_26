from django.shortcuts import render
from rest_framework import viewsets
from .models import Administrador, Editor
from .serializers import AdministradorSerializer, EditorSerializer

# views here.
class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer

class EditorViewSet(viewsets.ModelViewSet):
    queryset = Editor.objects.all()
    serializer_class = EditorSerializer