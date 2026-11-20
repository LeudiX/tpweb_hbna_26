import json
import logging
import re
from datetime import timezone as datetime_timezone

import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone

from .models import Auditoria


logger = logging.getLogger(__name__)
_INTEGER_PREFIX = re.compile(r"^\s*([+-]?\d+)")


def json_response(data, status=200):
    return JsonResponse(
        data,
        safe=not isinstance(data, list),
        status=status,
        json_dumps_params={"ensure_ascii": False},
    )


def json_error(message, status):
    return json_response({"error": message}, status=status)


def parse_json_body(request):
    if not request.body:
        return {}, True
    try:
        body = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return {}, False
    return (body if isinstance(body, dict) else {}), True


def parse_int(value, default=None):
    if value is None:
        return default
    match = _INTEGER_PREFIX.match(str(value))
    return int(match.group(1)) if match else default


def authenticate_request(request, allowed_roles=None):
    authorization = request.headers.get("Authorization", "")
    token = authorization[7:] if authorization.startswith("Bearer ") else None
    if not token:
        return json_error("Token requerido", 401)

    try:
        claims = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        if not isinstance(claims, dict):
            raise jwt.InvalidTokenError("El contenido del token no es válido")
    except jwt.PyJWTError:
        return json_error("Token inválido o expirado", 401)

    request.authenticated_user = claims
    if allowed_roles is not None and claims.get("rol") not in allowed_roles:
        return json_error("No autorizado para esta acción", 403)
    return None


def record_audit(request, action, entity, entity_id=None, details=None):
    try:
        user = getattr(request, "authenticated_user", {})
        if isinstance(details, str):
            detail_text = details or None
        elif details is not None:
            detail_text = json.dumps(
                details, ensure_ascii=False, separators=(",", ":")
            )
        else:
            detail_text = None

        Auditoria.objects.create(
            usuario_id=user.get("id"),
            username=user.get("username"),
            accion=action,
            entidad=entity,
            entidad_id=entity_id or None,
            detalles=detail_text,
            ip=request.META.get("REMOTE_ADDR"),
        )
    except Exception:
        # Un fallo de auditoría no debe cancelar la operación principal.
        logger.exception("Error registrando auditoría")


def display_datetime(value):
    if value is None:
        return None
    if hasattr(value, "strftime"):
        if timezone.is_aware(value):
            value = timezone.localtime(value, timezone=datetime_timezone.utc)
        return value.strftime("%Y-%m-%d %H:%M:%S")
    return value
