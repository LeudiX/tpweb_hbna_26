import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponseRedirect


def _serve(root, asset_path):
    base = Path(root).resolve()
    target = (base / asset_path).resolve()
    try:
        target.relative_to(base)
    except ValueError as exc:
        raise Http404 from exc

    if not target.is_file():
        raise Http404

    content_type, _ = mimetypes.guess_type(str(target))
    return FileResponse(target.open("rb"), content_type=content_type)


def jump_index(request):
    return HttpResponseRedirect("/jump/frontend/html/index.html")


def jump_asset(request, asset_path):
    return _serve(settings.FRONTEND_ROOT, asset_path)


def logo_asset(request, asset_path):
    return _serve(settings.ASSET_ROOT, asset_path)


def faculty_image(request, asset_path):
    return _serve(settings.IMAGE_ROOT, asset_path)
