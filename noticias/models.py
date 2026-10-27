from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from usuarios.models import Usuario 

class Noticia(models.Model):
    titulo = models.CharField(max_length=200, verbose_name="Título")
    imagen = models.ImageField(upload_to='noticias/', verbose_name="Imagen")
    contenido = models.TextField(verbose_name="Contenido")
    fecha = models.DateField(verbose_name="Fecha de publicación")
    
    # Apunta a Usuario (puede ser Admin o Editor)
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='noticias_creadas')

    def clean(self):
        if self.fecha and self.fecha > timezone.now().date():
            raise ValidationError({'fecha': 'La fecha de la noticia no puede ser en el futuro.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Noticia"
        verbose_name_plural = "Noticias"
        ordering = ['-fecha']

class Evento(models.Model):
    titulo = models.CharField(max_length=200, verbose_name="Título")
    fecha_evento = models.DateField(verbose_name="Fecha del evento")
    objetivo = models.TextField(verbose_name="Objetivo")
    lugar = models.CharField(max_length=150, verbose_name="Lugar")
    
    # El encargado de crear el evento también es un Usuario
    encargado = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='eventos_encargados')

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['fecha_evento']