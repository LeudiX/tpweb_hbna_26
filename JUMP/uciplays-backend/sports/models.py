from django.db import models
from django.utils import timezone


class Facultad(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.TextField(unique=True, null=True, blank=True)
    logo_url = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "facultades"


class Deporte(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.TextField(unique=True)

    class Meta:
        db_table = "deportes"


class Equipo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.TextField()
    facultad = models.ForeignKey(
        Facultad,
        db_column="facultad_id",
        related_name="equipos",
        on_delete=models.PROTECT,
    )
    deporte = models.ForeignKey(
        Deporte,
        db_column="deporte_id",
        related_name="equipos",
        on_delete=models.PROTECT,
    )

    class Meta:
        db_table = "equipos"
        constraints = [
            models.UniqueConstraint(
                fields=("facultad", "deporte"),
                name="uq_equipo_facultad_deporte",
            )
        ]


class Integrante(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.TextField()
    ci = models.TextField(unique=True)
    matricula = models.TextField(unique=True)
    equipo = models.ForeignKey(
        Equipo,
        db_column="equipo_id",
        related_name="integrantes",
        on_delete=models.PROTECT,
    )

    class Meta:
        db_table = "integrantes"


class Evento(models.Model):
    id = models.AutoField(primary_key=True)
    deporte = models.ForeignKey(
        Deporte,
        db_column="deporte_id",
        related_name="eventos",
        on_delete=models.PROTECT,
    )
    fecha = models.TextField(null=True, blank=True)
    hora = models.TextField(null=True, blank=True)
    lugar = models.TextField(null=True, blank=True)
    estado = models.TextField(default="pendiente", null=True, blank=True)
    detalles = models.TextField(default="", null=True, blank=True)

    class Meta:
        db_table = "eventos"


class EventoParticipante(models.Model):
    id = models.AutoField(primary_key=True)
    evento = models.ForeignKey(
        Evento,
        db_column="evento_id",
        related_name="participaciones",
        on_delete=models.CASCADE,
    )
    equipo = models.ForeignKey(
        Equipo,
        db_column="equipo_id",
        related_name="participaciones",
        on_delete=models.PROTECT,
    )
    posicion = models.IntegerField(null=True, blank=True)
    puntos = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        db_table = "evento_participantes"
        constraints = [
            models.UniqueConstraint(
                fields=("evento", "equipo"),
                name="uq_evento_participante_equipo",
            )
        ]


class Sancion(models.Model):
    id = models.AutoField(primary_key=True)
    equipo = models.ForeignKey(
        Equipo,
        db_column="equipo_id",
        related_name="sanciones",
        on_delete=models.PROTECT,
    )
    puntos_descontados = models.IntegerField()
    motivo = models.TextField(null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)
    fecha = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        db_table = "sanciones"


class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.TextField(unique=True)
    password_hash = models.TextField()
    rol = models.TextField(default="admin")
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "usuarios"


class Auditoria(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario,
        db_column="usuario_id",
        related_name="auditorias",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    username = models.TextField(null=True, blank=True)
    accion = models.TextField()
    entidad = models.TextField()
    entidad_id = models.IntegerField(null=True, blank=True)
    detalles = models.TextField(null=True, blank=True)
    ip = models.TextField(null=True, blank=True)
    fecha = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        db_table = "auditoria"
