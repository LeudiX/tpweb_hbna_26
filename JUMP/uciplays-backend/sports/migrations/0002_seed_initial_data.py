from django.db import migrations


FACULTIES = [
    ("FTL", "FTL.webp"),
    ("FTI", "FTI.webp"),
    ("FC", "FC.webp"),
    ("FTE", "FTE.webp"),
    ("FIO", "FIO.webp"),
    ("CITEC", "CITEC.webp"),
]
SPORTS = [
    ("Volleyball", "V"),
    ("Fútbol", "F"),
    ("Béisbol", "B"),
    ("Ajedrez", "A"),
]


def seed_initial_data(apps, schema_editor):
    using = schema_editor.connection.alias
    Facultad = apps.get_model("sports", "Facultad")
    Deporte = apps.get_model("sports", "Deporte")
    Equipo = apps.get_model("sports", "Equipo")
    Integrante = apps.get_model("sports", "Integrante")
    Evento = apps.get_model("sports", "Evento")
    EventoParticipante = apps.get_model("sports", "EventoParticipante")
    Sancion = apps.get_model("sports", "Sancion")

    # No completar ni reescribir una base existente: las semillas solo aplican
    # a una instalación realmente vacía.
    domain_models = [
        Facultad,
        Deporte,
        Equipo,
        Integrante,
        Evento,
        EventoParticipante,
        Sancion,
        apps.get_model("sports", "Usuario"),
        apps.get_model("sports", "Auditoria"),
    ]
    if any(model.objects.using(using).exists() for model in domain_models):
        return

    faculties = {}
    for name, logo in FACULTIES:
        faculty, _ = Facultad.objects.using(using).get_or_create(
            nombre=name,
            defaults={"logo_url": f"/img/{logo}"},
        )
        faculties[name] = faculty
    sports = {}
    for name, _suffix in SPORTS:
        sport, _ = Deporte.objects.using(using).get_or_create(nombre=name)
        sports[name] = sport

    teams = {}
    for faculty_name, faculty in faculties.items():
        for sport_name, _suffix in SPORTS:
            team, _ = Equipo.objects.using(using).get_or_create(
                facultad_id=faculty.pk,
                deporte_id=sports[sport_name].pk,
                defaults={"nombre": f"{faculty_name} {sport_name}"},
            )
            teams[(faculty_name, sport_name)] = team

    if not Integrante.objects.using(using).exists():
        number = 1
        for faculty_name, _faculty in FACULTIES:
            for sport_name, suffix in SPORTS:
                team = teams[(faculty_name, sport_name)]
                for member_number in range(1, 4):
                    Integrante.objects.using(using).create(
                        nombre=f"Integrante {member_number} {faculty_name} {suffix}",
                        ci=f"CI{number:04d}",
                        matricula=f"MAT{number:04d}",
                        equipo_id=team.pk,
                    )
                    number += 1

    event_specs = [
        ("Volleyball", "2026-02-05", "10:00", "Cancha 1"),
        ("Fútbol", "2026-03-12", "15:30", "Cancha 2"),
        ("Béisbol", "2026-04-20", "09:00", "Campo 3"),
        ("Ajedrez", "2026-05-08", "14:00", "Sala"),
    ]
    events = {}
    for sport_name, date, time, place in event_specs:
        event, _ = Evento.objects.using(using).get_or_create(
            deporte_id=sports[sport_name].pk,
            fecha=date,
            hora=time,
            lugar=place,
            defaults={"estado": "en curso", "detalles": ""},
        )
        events[sport_name] = event

    participants = [
        ("Volleyball", "FTL", "Volleyball"),
        ("Volleyball", "FTI", "Volleyball"),
        ("Fútbol", "FC", "Fútbol"),
        ("Fútbol", "FTE", "Fútbol"),
        ("Béisbol", "FIO", "Béisbol"),
        ("Béisbol", "CITEC", "Béisbol"),
        ("Ajedrez", "FTL", "Ajedrez"),
        ("Ajedrez", "FTI", "Ajedrez"),
        ("Ajedrez", "FC", "Ajedrez"),
    ]
    for event_sport, faculty_name, team_sport in participants:
        EventoParticipante.objects.using(using).get_or_create(
            evento_id=events[event_sport].pk,
            equipo_id=teams[(faculty_name, team_sport)].pk,
            defaults={"posicion": None, "puntos": 0},
        )

    sanctions = [
        ("FTL", "Volleyball", -2, "Retraso", "Integrante 1 FTL V"),
        ("FTI", "Fútbol", -5, "Conducta antideportiva", "Integrante 2 FTI F"),
        ("FC", "Fútbol", -8, "Amonestación múltiple", "Integrantes 1 y 3 FC F"),
        ("FTE", "Volleyball", -5, "Uniforme incorrecto", "Integrante 1 FTE V"),
        ("FIO", "Béisbol", -3, "Retraso", "Integrante 2 FIO B"),
        ("CITEC", "Fútbol", -12, "Agresión", "Integrante 1 CITEC F"),
        (
            "CITEC",
            "Ajedrez",
            -4,
            "Dispositivo no permitido",
            "Integrante 3 CITEC A",
        ),
    ]
    if not Sancion.objects.using(using).exists():
        for faculty_name, sport_name, points, reason, notes in sanctions:
            Sancion.objects.using(using).create(
                equipo_id=teams[(faculty_name, sport_name)].pk,
                puntos_descontados=points,
                motivo=reason,
                observaciones=notes,
            )


class Migration(migrations.Migration):
    dependencies = [("sports", "0001_initial")]

    operations = [migrations.RunPython(seed_initial_data, migrations.RunPython.noop)]
