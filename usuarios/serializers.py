from rest_framework import serializers
from .models import Usuario, Administrador, Editor

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'ci']
        # Nota: La contraseña no se incluye aquí por seguridad

class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = ['id', 'username', 'email', 'ci']

class EditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Editor
        fields = ['id', 'username', 'email', 'ci']