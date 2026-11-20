from django.urls import re_path

from . import views


urlpatterns = [
    re_path(r"^ranking/?$", views.ranking, name="ranking"),
    re_path(r"^facultades/?$", views.facultades, name="facultades"),
    re_path(r"^facultades/(?P<pk>\d+)/?$", views.facultad, name="facultad"),
    re_path(r"^eventos/?$", views.eventos, name="eventos"),
    re_path(r"^eventos/(?P<pk>\d+)/iniciar/?$", views.iniciar_evento, name="iniciar-evento"),
    re_path(r"^eventos/(?P<pk>\d+)/resultado/?$", views.registrar_resultado, name="resultado-evento"),
    re_path(r"^eventos/(?P<pk>\d+)/?$", views.evento, name="evento"),
    re_path(r"^sanciones/?$", views.sanciones, name="sanciones"),
    re_path(r"^sanciones/(?P<pk>\d+)/?$", views.sancion, name="sancion"),
    re_path(r"^integrantes/?$", views.integrantes, name="integrantes"),
    re_path(r"^integrantes/(?P<equipo_id>\d+)/?$", views.integrantes_equipo, name="integrantes-equipo"),
    re_path(r"^deportes/?$", views.deportes, name="deportes"),
    re_path(r"^deportes/(?P<pk>\d+)/?$", views.deporte, name="deporte"),
    re_path(r"^equipos/?$", views.equipos, name="equipos"),
    re_path(r"^equipos/(?P<pk>\d+)/?$", views.equipo, name="equipo"),
    re_path(r"^auth/login/?$", views.login, name="auth-login"),
    re_path(r"^auth/logout/?$", views.logout, name="auth-logout"),
    re_path(r"^auth/me/?$", views.me, name="auth-me"),
    re_path(r"^auditoria/?$", views.auditoria, name="auditoria"),
    re_path(r"^backup/?$", views.backup, name="backup"),
]
