from django.shortcuts import render
from rest_framework import viewsets
from .models import Administrador, Editor
from .serializers import AdministradorSerializer, EditorSerializer
from .permissions import IsAdministrador, IsEditor, IsAdminOEditor

# views here.
class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer
    permission_classes = [IsAdministrador] 

class EditorViewSet(viewsets.ModelViewSet):
    queryset = Editor.objects.all()
    serializer_class = EditorSerializer
    permission_classes = [IsAdminOEditor] 