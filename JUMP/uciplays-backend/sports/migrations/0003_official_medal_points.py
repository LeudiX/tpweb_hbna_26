from django.db import migrations
from django.db.models import Case, IntegerField, Value, When


def apply_official_medal_points(apps, schema_editor):
    EventoParticipante = apps.get_model("sports", "EventoParticipante")
    database = schema_editor.connection.alias

    EventoParticipante.objects.using(database).filter(posicion__isnull=False).update(
        puntos=Case(
            When(posicion=1, then=Value(31)),
            When(posicion=2, then=Value(15)),
            When(posicion=3, then=Value(7)),
            When(posicion=4, then=Value(2)),
            When(posicion=5, then=Value(1)),
            default=Value(0),
            output_field=IntegerField(),
        )
    )


class Migration(migrations.Migration):
    dependencies = [("sports", "0002_seed_initial_data")]

    operations = [
        migrations.RunPython(
            apply_official_medal_points,
            migrations.RunPython.noop,
        )
    ]
