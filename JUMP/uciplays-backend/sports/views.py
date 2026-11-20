from io import StringIO
import logging
import time

import bcrypt
import jwt
from django.conf import settings
from django.core.management import call_command
from django.db import connection, transaction
from django.db.models import Count
from django.http import HttpResponse
from django.utils import timezone
from django.views.decorators.http import require_http_methods

from .api_utils import (
    authenticate_request,
    display_datetime,
    json_error,
    json_response,
    parse_int,
    parse_json_body,
    record_audit,
)
from .models import (
    Deporte,
    Equipo,
    Evento,
    EventoParticipante,
    Facultad,
    Integrante,
    Sancion,
    Usuario,
)


logger = logging.getLogger(__name__)


def _exception_response(message, exception):
    logger.exception(message)
    return json_error(str(exception), 500)


def _error_from_body(ok):
    return None if ok else json_error("JSON inválido", 400)


def _faculty_dto(row):
    return {
        "id": row.id,
        "nombre": row.nombre,
        "logo_url": row.logo_url,
        "total_equipos": getattr(row, "total_equipos", 0) or 0,
    }


def _sport_dto(row):
    return {
        "id": row.id,
        "nombre": row.nombre,
        "total_equipos": getattr(row, "total_equipos", 0) or 0,
    }


def _team_dto(row):
    return {
        "id": row.id,
        "nombre": row.nombre,
        "facultad": row.facultad.nombre,
        "deporte": row.deporte.nombre,
        "facultad_id": row.facultad_id,
        "deporte_id": row.deporte_id,
        "total_eventos": getattr(row, "total_eventos", 0) or 0,
    }


def _member_dto(row):
    return {
        "id": row.id,
        "nombre": row.nombre,
        "ci": row.ci,
        "matricula": row.matricula,
        "equipo_id": row.equipo_id,
        "equipo_nombre": row.equipo.nombre,
        "facultad_nombre": row.equipo.facultad.nombre,
        "deporte": row.equipo.deporte.nombre,
    }


def _sanction_dto(row):
    return {
        "id": row.id,
        "equipo_id": row.equipo_id,
        "equipo_nombre": row.equipo.nombre,
        "facultad_nombre": row.equipo.facultad.nombre,
        "deporte": row.equipo.deporte.nombre,
        "puntos_descontados": row.puntos_descontados,
        "motivo": row.motivo,
        "observaciones": row.observaciones,
        "fecha": display_datetime(row.fecha),
    }


def _participant_dto(row):
    return {
        "id": row.id,
        "equipo_id": row.equipo_id,
        "equipo_nombre": row.equipo.nombre or None,
        "facultad": row.equipo.facultad.nombre or None,
        "deporte": row.equipo.deporte.nombre or None,
        "posicion": row.posicion,
        "puntos": row.puntos if row.puntos is not None else 0,
    }


def _event_dto(row):
    participants = (
        row.participaciones.select_related(
            "equipo", "equipo__facultad", "equipo__deporte"
        )
        .all()
    )
    participants = sorted(
        participants,
        key=lambda item: (
            item.posicion if item.posicion is not None else 999,
            item.equipo.nombre,
        ),
    )
    return {
        "id": row.id,
        "deporte_id": row.deporte_id,
        "deporte": row.deporte.nombre,
        "fecha": row.fecha,
        "hora": row.hora,
        "lugar": row.lugar,
        "estado": row.estado,
        "detalles": row.detalles,
        "participantes": [_participant_dto(item) for item in participants],
    }


def _points_for_position(position):
    if isinstance(position, (int, float)) and not isinstance(position, bool):
        if position == 1:
            return 31
        if position == 2:
            return 15
        if position == 3:
            return 7
        if position == 4:
            return 2
        if position == 5:
            return 1
    return 0


@require_http_methods(["GET"])
def ranking(request):
    try:
        # Se conserva la consulta del ranking vigente: puntos de eventos más
        # sanciones, con el mismo desempate alfabético.
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    f.id,
                    f.nombre,
                    f.logo_url,
                    COALESCE(SUM(CASE WHEN ep.posicion = 1 THEN 1 ELSE 0 END), 0) AS oros,
                    COALESCE(SUM(CASE WHEN ep.posicion = 2 THEN 1 ELSE 0 END), 0) AS platas,
                    COALESCE(SUM(CASE WHEN ep.posicion = 3 THEN 1 ELSE 0 END), 0) AS bronces,
                    COALESCE(SUM(CASE WHEN ep.posicion = 4 THEN 1 ELSE 0 END), 0) AS cuarto,
                    COALESCE(SUM(CASE WHEN ep.posicion = 5 THEN 1 ELSE 0 END), 0) AS quinto,
                    COALESCE(SUM(ep.puntos), 0) AS puntos_eventos,
                    COALESCE((
                        SELECT SUM(s.puntos_descontados)
                        FROM sanciones s
                        JOIN equipos eq ON eq.id = s.equipo_id
                        WHERE eq.facultad_id = f.id
                    ), 0) AS puntos_sanciones,
                    COALESCE(SUM(ep.puntos), 0) + COALESCE((
                        SELECT SUM(s.puntos_descontados)
                        FROM sanciones s
                        JOIN equipos eq ON eq.id = s.equipo_id
                        WHERE eq.facultad_id = f.id
                    ), 0) AS puntos
                FROM facultades f
                LEFT JOIN equipos e ON e.facultad_id = f.id
                LEFT JOIN evento_participantes ep ON ep.equipo_id = e.id
                GROUP BY f.id, f.nombre, f.logo_url
                ORDER BY puntos DESC, f.nombre ASC
                """
            )
            fields = [column[0] for column in cursor.description]
            rows = [dict(zip(fields, row)) for row in cursor.fetchall()]
        return json_response(
            [
                {
                    "id": row["id"],
                    "nombre": row["nombre"],
                    "logo_url": row["logo_url"],
                    "oros": row["oros"] or 0,
                    "platas": row["platas"] or 0,
                    "bronces": row["bronces"] or 0,
                    "cuarto": row["cuarto"] or 0,
                    "quinto": row["quinto"] or 0,
                    "puntos_eventos": row["puntos_eventos"] or 0,
                    "puntos_sanciones": row["puntos_sanciones"] or 0,
                    "puntos": row["puntos"] or 0,
                }
                for row in rows
            ]
        )
    except Exception as exc:
        logger.exception("Error GET /ranking")
        return json_error("Error al obtener ranking", 500)


@require_http_methods(["GET", "POST"])
def facultades(request):
    if request.method == "GET":
        try:
            rows = Facultad.objects.annotate(
                total_equipos=Count("equipos")
            ).order_by("nombre")
            return json_response([_faculty_dto(row) for row in rows])
        except Exception:
            logger.exception("Error GET /facultades")
            return json_error("Error al obtener facultades", 500)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    nombre = str(body.get("nombre") or "").strip()
    if len(nombre) < 2:
        return json_error("El nombre debe tener al menos 2 caracteres", 400)
    if Facultad.objects.filter(nombre__iexact=nombre).exists():
        return json_error("Ya existe una facultad con ese nombre", 409)
    try:
        row = Facultad.objects.create(nombre=nombre, logo_url=body.get("logo_url"))
        record_audit(request, "crear", "facultad", row.id, {"nombre": nombre})
        return json_response(
            {"message": "Creado", "id": row.id, "nombre": nombre}, status=201
        )
    except Exception:
        logger.exception("Error POST /facultades")
        return json_error("Error al crear facultad", 500)


@require_http_methods(["GET", "PUT", "DELETE"])
def facultad(request, pk):
    if request.method == "GET":
        if int(pk) == 0:
            return json_error("ID inválido", 400)
        try:
            row = Facultad.objects.filter(pk=pk).first()
            if row is None:
                return json_error("Facultad no encontrada", 404)
            return json_response(_faculty_dto(row))
        except Exception:
            logger.exception("Error GET /facultades/:id")
            return json_error("Error al obtener facultad", 500)

    auth = authenticate_request(request)
    if auth:
        return auth

    if request.method == "PUT":
        body, ok = parse_json_body(request)
        invalid = _error_from_body(ok)
        if invalid:
            return invalid
        nombre = str(body.get("nombre") or "").strip()
        if len(nombre) < 2:
            return json_error("El nombre debe tener al menos 2 caracteres", 400)
        if Facultad.objects.filter(nombre__iexact=nombre).exclude(pk=pk).exists():
            return json_error("Ya existe otra facultad con ese nombre", 409)
        try:
            Facultad.objects.filter(pk=pk).update(
                nombre=nombre, logo_url=body.get("logo_url")
            )
            record_audit(request, "editar", "facultad", pk, {"nombre": nombre})
            return json_response({"message": "Actualizado"})
        except Exception:
            logger.exception("Error PUT /facultades/:id")
            return json_error("Error al editar facultad", 500)

    cascade = request.GET.get("cascade") == "true"
    try:
        total = Equipo.objects.filter(facultad_id=pk).count()
        if total > 0 and not cascade:
            return json_error(
                f"La facultad tiene {total} equipos. Usa cascade=true para borrarla con ellos.",
                409,
            )
        with transaction.atomic():
            if total > 0 and cascade:
                team_ids = list(
                    Equipo.objects.filter(facultad_id=pk).values_list("id", flat=True)
                )
                EventoParticipante.objects.filter(equipo_id__in=team_ids).delete()
                Sancion.objects.filter(equipo_id__in=team_ids).delete()
                Integrante.objects.filter(equipo_id__in=team_ids).delete()
                Equipo.objects.filter(facultad_id=pk).delete()
            Facultad.objects.filter(pk=pk).delete()
        record_audit(request, "borrar", "facultad", pk, {"cascade": cascade})
        return json_response({"message": "Eliminado", "cascade": cascade})
    except Exception:
        logger.exception("Error DELETE /facultades/:id")
        return json_error("Error al borrar facultad", 500)


@require_http_methods(["GET", "POST"])
def deportes(request):
    if request.method == "GET":
        try:
            rows = Deporte.objects.annotate(
                total_equipos=Count("equipos")
            ).order_by("nombre")
            return json_response([_sport_dto(row) for row in rows])
        except Exception:
            logger.exception("Error GET /deportes")
            return json_error("Error al obtener deportes", 500)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    nombre = str(body.get("nombre") or "").strip()
    if len(nombre) < 2:
        return json_error("El nombre debe tener al menos 2 caracteres", 400)
    if Deporte.objects.filter(nombre__iexact=nombre).exists():
        return json_error("Ya existe un deporte con ese nombre", 409)
    try:
        with transaction.atomic():
            row = Deporte.objects.create(nombre=nombre)
            faculties = Facultad.objects.order_by("id")
            for faculty in faculties:
                Equipo.objects.create(
                    nombre=f"{faculty.nombre} {nombre}",
                    facultad=faculty,
                    deporte=row,
                )
        record_audit(
            request,
            "crear",
            "deporte",
            row.id,
            {"nombre": nombre, "equipos": faculties.count()},
        )
        return json_response(
            {
                "message": "Creado",
                "id": row.id,
                "nombre": nombre,
                "equipos": faculties.count(),
            },
            status=201,
        )
    except Exception:
        logger.exception("Error POST /deportes")
        return json_error("Error al crear deporte", 500)


@require_http_methods(["PUT", "DELETE"])
def deporte(request, pk):
    auth = authenticate_request(request)
    if auth:
        return auth

    if request.method == "PUT":
        body, ok = parse_json_body(request)
        invalid = _error_from_body(ok)
        if invalid:
            return invalid
        nombre = str(body.get("nombre") or "").strip()
        if len(nombre) < 2:
            return json_error("Nombre inválido", 400)
        if Deporte.objects.filter(nombre__iexact=nombre).exclude(pk=pk).exists():
            return json_error("Ya existe otro deporte con ese nombre", 409)
        try:
            Deporte.objects.filter(pk=pk).update(nombre=nombre)
            record_audit(request, "editar", "deporte", pk, {"nombre": nombre})
            return json_response({"message": "Actualizado"})
        except Exception:
            logger.exception("Error PUT /deportes/:id")
            return json_error("Error al editar deporte", 500)

    try:
        total = Equipo.objects.filter(deporte_id=pk).count()
        if total > 0:
            return json_error(
                f"No se puede borrar: hay {total} equipos asociados", 409
            )
        Deporte.objects.filter(pk=pk).delete()
        record_audit(request, "borrar", "deporte", pk)
        return json_response({"message": "Eliminado"})
    except Exception:
        logger.exception("Error DELETE /deportes/:id")
        return json_error("Error al borrar deporte", 500)


@require_http_methods(["GET", "POST"])
def equipos(request):
    if request.method == "GET":
        try:
            rows = (
                Equipo.objects.select_related("facultad", "deporte")
                .annotate(total_eventos=Count("participaciones"))
                .order_by("facultad__nombre", "deporte__nombre", "nombre")
            )
            return json_response([_team_dto(row) for row in rows])
        except Exception:
            logger.exception("Error GET /equipos")
            return json_error("Error al obtener equipos", 500)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    nombre = str(body.get("nombre") or "").strip()
    facultad_id = parse_int(body.get("facultad_id"))
    deporte_id = parse_int(body.get("deporte_id"))
    if len(nombre) < 2:
        return json_error("El nombre debe tener al menos 2 caracteres", 400)
    if not facultad_id or not deporte_id:
        return json_error("facultad_id y deporte_id son requeridos", 400)
    if Equipo.objects.filter(
        facultad_id=facultad_id, deporte_id=deporte_id
    ).exists():
        return json_error(
            "Ya existe un equipo de esa facultad para ese deporte", 409
        )
    try:
        row = Equipo.objects.create(
            nombre=nombre,
            facultad_id=facultad_id,
            deporte_id=deporte_id,
        )
        record_audit(
            request,
            "crear",
            "equipo",
            row.id,
            {"nombre": nombre, "facultadId": facultad_id, "deporteId": deporte_id},
        )
        return json_response({"message": "Creado", "id": row.id}, status=201)
    except Exception:
        logger.exception("Error POST /equipos")
        return json_error("Error al crear equipo", 500)


@require_http_methods(["PUT", "DELETE"])
def equipo(request, pk):
    auth = authenticate_request(request)
    if auth:
        return auth

    if request.method == "PUT":
        body, ok = parse_json_body(request)
        invalid = _error_from_body(ok)
        if invalid:
            return invalid
        nombre = str(body.get("nombre") or "").strip()
        facultad_id = parse_int(body.get("facultad_id"))
        deporte_id = parse_int(body.get("deporte_id"))
        if len(nombre) < 2:
            return json_error("El nombre debe tener al menos 2 caracteres", 400)
        if (
            facultad_id
            and deporte_id
            and Equipo.objects.filter(
                facultad_id=facultad_id, deporte_id=deporte_id
            )
            .exclude(pk=pk)
            .exists()
        ):
            return json_error(
                "Ya existe otro equipo de esa facultad para ese deporte", 409
            )
        try:
            Equipo.objects.filter(pk=pk).update(
                nombre=nombre,
                facultad_id=facultad_id,
                deporte_id=deporte_id,
            )
            record_audit(request, "editar", "equipo", pk, {"nombre": nombre})
            return json_response({"message": "Actualizado"})
        except Exception:
            logger.exception("Error PUT /equipos/:id")
            return json_error("Error al editar equipo", 500)

    try:
        total = EventoParticipante.objects.filter(equipo_id=pk).count()
        if total > 0:
            return json_error(f"El equipo tiene {total} eventos asociados", 409)
        with transaction.atomic():
            Integrante.objects.filter(equipo_id=pk).delete()
            Sancion.objects.filter(equipo_id=pk).delete()
            Equipo.objects.filter(pk=pk).delete()
        record_audit(request, "borrar", "equipo", pk)
        return json_response({"message": "Eliminado"})
    except Exception:
        logger.exception("Error DELETE /equipos/:id")
        return json_error("Error al borrar equipo", 500)


@require_http_methods(["GET", "POST"])
def integrantes(request):
    if request.method == "GET":
        try:
            rows = Integrante.objects.select_related(
                "equipo", "equipo__facultad", "equipo__deporte"
            ).order_by("equipo__facultad__nombre", "equipo__nombre", "nombre")
            return json_response([_member_dto(row) for row in rows])
        except Exception:
            logger.exception("Error GET /integrantes")
            return json_error("Error al obtener integrantes", 500)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    nombre = str(body.get("nombre") or "").strip()
    ci = str(body.get("ci") or "").strip()
    matricula = str(body.get("matricula") or "").strip()
    equipo_id = parse_int(body.get("equipo_id"))
    if len(nombre) < 2:
        return json_error("Nombre inválido", 400)
    if not ci:
        return json_error("CI requerida", 400)
    if not matricula:
        return json_error("Matrícula requerida", 400)
    if not equipo_id:
        return json_error("equipo_id requerido", 400)
    if Integrante.objects.filter(ci=ci).exists():
        return json_error("Ya existe un integrante con esa CI", 409)
    if Integrante.objects.filter(matricula=matricula).exists():
        return json_error("Ya existe un integrante con esa matrícula", 409)
    try:
        row = Integrante.objects.create(
            nombre=nombre, ci=ci, matricula=matricula, equipo_id=equipo_id
        )
        record_audit(
            request,
            "crear",
            "integrante",
            row.id,
            {"nombre": nombre, "equipoId": equipo_id},
        )
        return json_response({"message": "Creado", "id": row.id}, status=201)
    except Exception:
        logger.exception("Error POST /integrantes")
        return json_error("Error al crear integrante", 500)


@require_http_methods(["GET"])
def integrantes_equipo(request, equipo_id):
    try:
        rows = (
            Integrante.objects.filter(equipo_id=equipo_id)
            .select_related("equipo", "equipo__facultad", "equipo__deporte")
            .order_by("nombre")
        )
        return json_response([_member_dto(row) for row in rows])
    except Exception:
        logger.exception("Error GET /integrantes/:equipo_id")
        return json_error("Error al obtener integrantes del equipo", 500)


@require_http_methods(["PUT", "DELETE"])
def integrante(request, pk):
    auth = authenticate_request(request)
    if auth:
        return auth

    if request.method == "PUT":
        body, ok = parse_json_body(request)
        invalid = _error_from_body(ok)
        if invalid:
            return invalid
        nombre = str(body.get("nombre") or "").strip()
        ci = str(body.get("ci") or "").strip()
        matricula = str(body.get("matricula") or "").strip()
        if len(nombre) < 2:
            return json_error("Nombre inválido", 400)
        if not ci:
            return json_error("CI requerida", 400)
        if not matricula:
            return json_error("Matrícula requerida", 400)
        if Integrante.objects.filter(ci=ci).exclude(pk=pk).exists():
            return json_error("CI ya registrada en otro integrante", 409)
        if Integrante.objects.filter(matricula=matricula).exclude(pk=pk).exists():
            return json_error("Matrícula ya registrada en otro integrante", 409)
        try:
            Integrante.objects.filter(pk=pk).update(
                nombre=nombre, ci=ci, matricula=matricula
            )
            record_audit(request, "editar", "integrante", pk, {"nombre": nombre})
            return json_response({"message": "Actualizado"})
        except Exception:
            logger.exception("Error PUT /integrantes/:id")
            return json_error("Error al editar integrante", 500)

    try:
        Integrante.objects.filter(pk=pk).delete()
        record_audit(request, "borrar", "integrante", pk)
        return json_response({"message": "Eliminado"})
    except Exception:
        logger.exception("Error DELETE /integrantes/:id")
        return json_error("Error al borrar integrante", 500)


@require_http_methods(["GET", "POST"])
def sanciones(request):
    if request.method == "GET":
        try:
            rows = (
                Sancion.objects.select_related(
                    "equipo", "equipo__facultad", "equipo__deporte"
                )
                .order_by("-fecha")
            )
            return json_response([_sanction_dto(row) for row in rows])
        except Exception:
            logger.exception("Error GET /sanciones")
            return json_error("Error al obtener sanciones", 500)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    equipo_id = parse_int(body.get("equipo_id"))
    puntos = parse_int(body.get("puntos_descontados"))
    if not equipo_id:
        return json_error("equipo_id requerido", 400)
    if not puntos or puntos >= 0:
        return json_error("puntos_descontados debe ser un número negativo", 400)
    if not Equipo.objects.filter(pk=equipo_id).exists():
        return json_error("Equipo no encontrado", 404)
    try:
        row = Sancion.objects.create(
            equipo_id=equipo_id,
            puntos_descontados=puntos,
            motivo=body.get("motivo"),
            observaciones=body.get("observaciones"),
        )
        record_audit(
            request,
            "crear",
            "sancion",
            row.id,
            {"equipoId": equipo_id, "puntos": puntos},
        )
        return json_response({"message": "Creado", "id": row.id}, status=201)
    except Exception:
        logger.exception("Error POST /sanciones")
        return json_error("Error al crear sanción", 500)


@require_http_methods(["DELETE"])
def sancion(request, pk):
    auth = authenticate_request(request)
    if auth:
        return auth
    try:
        Sancion.objects.filter(pk=pk).delete()
        record_audit(request, "borrar", "sancion", pk)
        return json_response({"message": "Eliminado"})
    except Exception:
        logger.exception("Error DELETE /sanciones/:id")
        return json_error("Error al borrar sanción", 500)


@require_http_methods(["GET", "POST"])
def eventos(request):
    if request.method == "GET":
        try:
            rows = Evento.objects.select_related("deporte").order_by("fecha", "hora")
            estado = request.GET.get("estado")
            if estado:
                rows = rows.filter(estado=estado)
            return json_response([_event_dto(row) for row in rows])
        except Exception as exc:
            return _exception_response("Error GET /eventos", exc)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    deporte_id = body.get("deporte_id")
    participantes = body.get("participantes")
    participantes = participantes if isinstance(participantes, list) else []
    if not deporte_id:
        return json_error("deporte_id requerido", 400)
    if len(participantes) < 2:
        return json_error("Se requieren al menos 2 participantes", 400)
    try:
        with transaction.atomic():
            row = Evento.objects.create(
                deporte_id=deporte_id,
                fecha=body.get("fecha") or None,
                hora=body.get("hora") or None,
                lugar=body.get("lugar") or None,
                estado=body.get("estado") or "pendiente",
                detalles=body.get("detalles") or "",
            )
            for participant in participantes:
                if not isinstance(participant, dict):
                    continue
                equipo_id = participant.get("equipo_id")
                if not equipo_id:
                    continue
                EventoParticipante.objects.create(
                    evento=row, equipo_id=equipo_id, posicion=None, puntos=0
                )
        record_audit(
            request,
            "crear",
            "evento",
            row.id,
            {"deporte_id": deporte_id, "participantes": len(participantes)},
        )
        return json_response({"message": "Creado", "id": row.id}, status=201)
    except Exception as exc:
        return _exception_response("Error POST /eventos", exc)


@require_http_methods(["GET", "PUT", "DELETE"])
def evento(request, pk):
    if request.method == "GET":
        try:
            row = Evento.objects.select_related("deporte").filter(pk=pk).first()
            if row is None:
                return json_error("Evento no encontrado", 404)
            return json_response(_event_dto(row))
        except Exception as exc:
            return _exception_response("Error GET /eventos/:id", exc)

    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid

    if request.method == "PUT":
        participantes = body.get("participantes")
        participantes = participantes if isinstance(participantes, list) else []
        try:
            with transaction.atomic():
                Evento.objects.filter(pk=pk).update(
                    deporte_id=body.get("deporte_id"),
                    fecha=body.get("fecha") or None,
                    hora=body.get("hora") or None,
                    lugar=body.get("lugar") or None,
                    estado=body.get("estado") or "pendiente",
                    detalles=body.get("detalles") or "",
                )
                EventoParticipante.objects.filter(evento_id=pk).delete()
                for participant in participantes:
                    if not isinstance(participant, dict):
                        continue
                    equipo_id = participant.get("equipo_id")
                    if not equipo_id:
                        continue
                    EventoParticipante.objects.create(
                        evento_id=pk,
                        equipo_id=equipo_id,
                        posicion=participant.get("posicion") or None,
                        puntos=0,
                    )
            record_audit(
                request,
                "editar",
                "evento",
                pk,
                {"deporte_id": body.get("deporte_id")},
            )
            return json_response({"message": "Actualizado"})
        except Exception as exc:
            return _exception_response("Error PUT /eventos/:id", exc)

    try:
        with transaction.atomic():
            EventoParticipante.objects.filter(evento_id=pk).delete()
            Evento.objects.filter(pk=pk).delete()
        record_audit(request, "borrar", "evento", pk)
        return json_response({"message": "Eliminado"})
    except Exception as exc:
        return _exception_response("Error DELETE /eventos/:id", exc)


@require_http_methods(["POST"])
def iniciar_evento(request, pk):
    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    try:
        Evento.objects.filter(pk=pk).update(
            estado="en curso",
            fecha=body.get("fecha"),
            hora=body.get("hora"),
        )
        record_audit(
            request,
            "iniciar",
            "evento",
            pk,
            {"fecha": body.get("fecha"), "hora": body.get("hora")},
        )
        return json_response({"message": "Evento iniciado"})
    except Exception as exc:
        return _exception_response("Error POST /eventos/:id/iniciar", exc)


@require_http_methods(["POST"])
def registrar_resultado(request, pk):
    auth = authenticate_request(request)
    if auth:
        return auth
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    results = body.get("resultados")
    results = results if isinstance(results, list) else []
    if not results:
        return json_error("Se requiere al menos un resultado", 400)

    try:
        with transaction.atomic():
            evento = Evento.objects.select_for_update().filter(pk=pk).first()
            if evento is None:
                return json_error("Evento no encontrado", 404)

            participantes = list(
                EventoParticipante.objects.select_for_update()
                .filter(evento_id=pk)
                .order_by("equipo_id")
            )
            if len(results) != len(participantes):
                return json_error(
                    "Debes enviar una posición para cada equipo participante", 400
                )

            equipos_esperados = {participante.equipo_id for participante in participantes}
            equipos_recibidos = set()
            posiciones_recibidas = set()
            resultados_validados = []
            limite_posicion = len(participantes)

            for result in results:
                if not isinstance(result, dict):
                    return json_error("Cada resultado debe ser un objeto válido", 400)

                equipo_id = result.get("equipo_id")
                posicion = result.get("posicion")
                if type(equipo_id) is not int or type(posicion) is not int:
                    return json_error("Equipo y posición deben ser números enteros", 400)
                if equipo_id not in equipos_esperados:
                    return json_error(
                        "El equipo no pertenece a este evento", 400
                    )
                if equipo_id in equipos_recibidos:
                    return json_error("Un equipo aparece más de una vez", 400)
                if posicion < 1 or posicion > limite_posicion:
                    return json_error(
                        "La posición debe estar entre 1 y el total de participantes", 400
                    )
                if posicion in posiciones_recibidas:
                    return json_error("Las posiciones no pueden repetirse", 400)

                equipos_recibidos.add(equipo_id)
                posiciones_recibidas.add(posicion)
                resultados_validados.append((equipo_id, posicion))

            if equipos_recibidos != equipos_esperados:
                return json_error(
                    "Debes enviar todos los equipos participantes del evento", 400
                )

            for equipo_id, posicion in resultados_validados:
                actualizados = EventoParticipante.objects.filter(
                    evento_id=pk,
                    equipo_id=equipo_id,
                ).update(
                    posicion=posicion,
                    puntos=_points_for_position(posicion),
                )
                if actualizados != 1:
                    raise RuntimeError("No se pudo actualizar un participante del evento")

            evento_actualizado = Evento.objects.filter(pk=pk).update(
                estado="finalizado"
            )
            if evento_actualizado != 1:
                raise RuntimeError("No se pudo finalizar el evento")
        record_audit(
            request,
            "finalizar",
            "evento",
            pk,
            {"resultados": len(results)},
        )
        return json_response({"message": "Resultado guardado y evento finalizado"})
    except Exception as exc:
        return _exception_response("Error POST /eventos/:id/resultado", exc)


@require_http_methods(["POST"])
def login(request):
    body, ok = parse_json_body(request)
    invalid = _error_from_body(ok)
    if invalid:
        return invalid
    username = body.get("username")
    password = body.get("password")
    if not username or not password:
        return json_error("Usuario y contraseña requeridos", 400)
    try:
        user = Usuario.objects.filter(username=username).first()
        if user is None:
            return json_error("Credenciales incorrectas", 401)
        if not user.activo:
            return json_error("Usuario inactivo", 403)
        try:
            password_ok = bcrypt.checkpw(
                str(password).encode("utf-8"),
                user.password_hash.encode("utf-8"),
            )
        except (ValueError, TypeError):
            password_ok = False
        if not password_ok:
            return json_error("Credenciales incorrectas", 401)

        user_data = {"id": user.id, "username": user.username, "rol": user.rol}
        now = int(time.time())
        token = jwt.encode(
            {**user_data, "iat": now, "exp": now + 3600},
            settings.JWT_SECRET,
            algorithm="HS256",
        )
        request.authenticated_user = user_data
        record_audit(request, "login", "usuario", user.id, {"username": user.username})
        return json_response({"token": token, "user": user_data})
    except Exception:
        logger.exception("Error POST /auth/login")
        return json_error("Error al autenticar", 500)


@require_http_methods(["POST"])
def logout(request):
    auth = authenticate_request(request)
    if auth:
        return auth
    user = request.authenticated_user
    record_audit(
        request,
        "logout",
        "usuario",
        user.get("id"),
        {"username": user.get("username")},
    )
    return json_response({"message": "Logout registrado"})


@require_http_methods(["GET"])
def me(request):
    auth = authenticate_request(request)
    if auth:
        return auth
    return json_response({"user": request.authenticated_user})


@require_http_methods(["GET"])
def auditoria(request):
    auth = authenticate_request(request, allowed_roles=["admin"])
    if auth:
        return auth
    limit = parse_int(request.GET.get("limite"), default=100) or 100
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM auditoria ORDER BY fecha DESC LIMIT %s", [limit]
            )
            columns = [column[0] for column in cursor.description]
            rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return json_response(rows)
    except Exception:
        logger.exception("Error GET /auditoria")
        return json_error("Error al obtener auditoría", 500)


@require_http_methods(["GET"])
def backup(request):
    auth = authenticate_request(request, allowed_roles=["admin"])
    if auth:
        return auth
    date_suffix = timezone.now().date().isoformat()

    try:
        output = StringIO()
        call_command(
            "dumpdata", "sports", database="default", indent=2, stdout=output
        )
        response = HttpResponse(
            output.getvalue(), content_type="application/json; charset=utf-8"
        )
        response["Content-Disposition"] = (
            f'attachment; filename="uciplays-backup-{date_suffix}.json"'
        )
        return response
    except Exception:
        logger.exception("Error al generar la copia de seguridad")
        return json_error("No se pudo generar la copia de seguridad", 500)
