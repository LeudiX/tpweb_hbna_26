from django.contrib import admin
from .models import Noticia, Evento

# Registrar los modelos en el admin para poder gestionarlos desde la interfaz de administración
admin.site.register(Noticia)
admin.site.register(Evento)
