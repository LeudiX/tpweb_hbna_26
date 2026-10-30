from rest_framework import serializers
from .models import Noticia, Evento
from usuarios.models import Usuario

class UsuarioBasicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'first_name', 'last_name']

class NoticiaSerializer(serializers.ModelSerializer):
    autor_detalle = UsuarioBasicoSerializer(source='autor', read_only=True)

    class Meta:
        model = Noticia
        fields = ['id', 'titulo', 'imagen', 'contenido', 'fecha', 'autor', 'autor_detalle']

        # Para que el campp autor no sea requerido y si el usuario que hace la noticia no ingresa valor, lo ponga a él auto
        extra_kwargs = {'autor': {'required': False}}

class EventoSerializer(serializers.ModelSerializer):
    encargado_detalle = UsuarioBasicoSerializer(source='encargado', read_only=True)

    class Meta:
        model = Evento
        fields = ['id', 'titulo', 'fecha_evento', 'objetivo', 'lugar', 'encargado', 'encargado_detalle']
        extra_kwargs = {'encargado': {'required': False}}