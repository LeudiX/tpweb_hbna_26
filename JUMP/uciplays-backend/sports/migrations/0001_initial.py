import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Deporte",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("nombre", models.TextField(unique=True)),
            ],
            options={"db_table": "deportes"},
        ),
        migrations.CreateModel(
            name="Facultad",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("nombre", models.TextField(blank=True, null=True, unique=True)),
                ("logo_url", models.TextField(blank=True, null=True)),
            ],
            options={"db_table": "facultades"},
        ),
        migrations.CreateModel(
            name="Usuario",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("username", models.TextField(unique=True)),
                ("password_hash", models.TextField()),
                ("rol", models.TextField(default="admin")),
                ("activo", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={"db_table": "usuarios"},
        ),
        migrations.CreateModel(
            name="Equipo",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("nombre", models.TextField()),
                (
                    "deporte",
                    models.ForeignKey(
                        db_column="deporte_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="equipos",
                        to="sports.deporte",
                    ),
                ),
                (
                    "facultad",
                    models.ForeignKey(
                        db_column="facultad_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="equipos",
                        to="sports.facultad",
                    ),
                ),
            ],
            options={
                "db_table": "equipos",
                "constraints": [
                    models.UniqueConstraint(
                        fields=("facultad", "deporte"),
                        name="uq_equipo_facultad_deporte",
                    )
                ],
            },
        ),
        migrations.CreateModel(
            name="Evento",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("fecha", models.TextField(blank=True, null=True)),
                ("hora", models.TextField(blank=True, null=True)),
                ("lugar", models.TextField(blank=True, null=True)),
                ("estado", models.TextField(default="pendiente", blank=True, null=True)),
                ("detalles", models.TextField(default="", blank=True, null=True)),
                (
                    "deporte",
                    models.ForeignKey(
                        db_column="deporte_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="eventos",
                        to="sports.deporte",
                    ),
                ),
            ],
            options={"db_table": "eventos"},
        ),
        migrations.CreateModel(
            name="Integrante",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("nombre", models.TextField()),
                ("ci", models.TextField(unique=True)),
                ("matricula", models.TextField(unique=True)),
                (
                    "equipo",
                    models.ForeignKey(
                        db_column="equipo_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="integrantes",
                        to="sports.equipo",
                    ),
                ),
            ],
            options={"db_table": "integrantes"},
        ),
        migrations.CreateModel(
            name="Sancion",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("puntos_descontados", models.IntegerField()),
                ("motivo", models.TextField(blank=True, null=True)),
                ("observaciones", models.TextField(blank=True, null=True)),
                (
                    "fecha",
                    models.DateTimeField(
                        blank=True,
                        default=django.utils.timezone.now,
                        null=True,
                    ),
                ),
                (
                    "equipo",
                    models.ForeignKey(
                        db_column="equipo_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="sanciones",
                        to="sports.equipo",
                    ),
                ),
            ],
            options={"db_table": "sanciones"},
        ),
        migrations.CreateModel(
            name="EventoParticipante",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("posicion", models.IntegerField(blank=True, null=True)),
                ("puntos", models.IntegerField(blank=True, default=0, null=True)),
                (
                    "equipo",
                    models.ForeignKey(
                        db_column="equipo_id",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="participaciones",
                        to="sports.equipo",
                    ),
                ),
                (
                    "evento",
                    models.ForeignKey(
                        db_column="evento_id",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="participaciones",
                        to="sports.evento",
                    ),
                ),
            ],
            options={
                "db_table": "evento_participantes",
                "constraints": [
                    models.UniqueConstraint(
                        fields=("evento", "equipo"),
                        name="uq_evento_participante_equipo",
                    )
                ],
            },
        ),
        migrations.CreateModel(
            name="Auditoria",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("username", models.TextField(blank=True, null=True)),
                ("accion", models.TextField()),
                ("entidad", models.TextField()),
                ("entidad_id", models.IntegerField(blank=True, null=True)),
                ("detalles", models.TextField(blank=True, null=True)),
                ("ip", models.TextField(blank=True, null=True)),
                (
                    "fecha",
                    models.DateTimeField(
                        blank=True,
                        default=django.utils.timezone.now,
                        null=True,
                    ),
                ),
                (
                    "usuario",
                    models.ForeignKey(
                        blank=True,
                        db_column="usuario_id",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="auditorias",
                        to="sports.usuario",
                    ),
                ),
            ],
            options={"db_table": "auditoria"},
        ),
    ]
