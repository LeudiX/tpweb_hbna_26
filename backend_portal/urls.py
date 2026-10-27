from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('usuarios.urls')),
    path('api/noticias/', include('noticias.urls')),
]

# Esto es para que Django deje acceder a los archivos multimedia (imágenes) cuando estamos en modo DEBUG es decir en modo desarrollo, ya que en producción se hace de otra manera
# Le agrega a la lista de urls de Django, la url de los archivos multimedia y le dice que los busque en el directorio MEDIA_ROOT que este es físico
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)