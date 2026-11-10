from rest_framework import serializers

# Modulo de expresiones regulares en Django
import re

from .models import Administrador, Editor
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class AdministradorSerializer(serializers.ModelSerializer):
    # Obligamos a que el campo password sea requerido y no se muestre al consultar (write_only)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Administrador
        fields = ['username', 'email', 'ci', 'password']

    def create(self, validated_data):
        # Extraemos la contraseña de los datos validados
        password = validated_data.pop('password')
        
        # Creamos la instancia del administrador con la data recibida que ya es validada por Django auto
        admin = Administrador(**validated_data)
        
        # Encriptamos la contraseña 
        admin.set_password(password)
        
        # Le damos permisos de staff y superusuario para que pueda entrar al panel /admin
        admin.is_staff = True
        admin.is_superuser = True 
        
        # Guardamos la info en a la BD
        admin.save()
        return admin

    # Función para validar la contraseña por defecto en DRF para cada campo de un serializer
    # Value sería la contraseña que se envío en el form
    def validate_password(self, value):
        
        # Si la contraseña no tiene al menos una May
        if not re.search(r'[A-Z]', value):

            # Muestra error 400
            raise serializers.ValidationError("La contraseña debe contener al menos una letra mayúscula.")
        
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("La contraseña debe contener al menos un número.")
        
        # Si lo contraseña no tiene como mín un caracter especial
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("La contraseña debe contener al menos un carácter especial.")
        
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        
        # Si pasa las validaciones se retorna para que create o update la encripten y lo guarde en la BD
        return value

class EditorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Editor
        fields = ['username', 'email', 'ci', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        editor = Editor(**validated_data)
        editor.set_password(password)
        
        # El editor sí necesita ser staff pero superusuario, él modifica algunas cosas.
        editor.is_staff = True
        editor.is_superuser = False
        
        editor.save()
        return editor
    
    # Función para validar la contraseña por defecto en DRF para cada campo de un serializer
    def validate_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra mayúscula.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("La contraseña debe contener al menos un número.")
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError("La contraseña debe contener al menos un carácter especial.")
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregamos el username al token
        token['username'] = user.username
        
        # Verificamos si es administrador o editor
        if hasattr(user, 'administrador'):
            token['rol'] = 'admin'
        elif hasattr(user, 'editor'):
            token['rol'] = 'editor'
        else:
            token['rol'] = 'desconocido'

        return token