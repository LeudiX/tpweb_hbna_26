import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
REPOSITORY_ROOT = BASE_DIR.parent
load_dotenv(BASE_DIR / ".env")

JWT_SECRET = os.environ.get("JWT_SECRET", "")
if not JWT_SECRET:
    raise ImproperlyConfigured(
        "Define JWT_SECRET en uciplays-backend/.env antes de arrancar el servidor."
    )

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY") or JWT_SECRET
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() in {"1", "true", "yes"}
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        "DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,testserver"
    ).split(",")
    if host.strip()
]

INSTALLED_APPS = ["sports.apps.SportsConfig"]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "sports.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "django_project.urls"
WSGI_APPLICATION = "django_project.wsgi.application"
ASGI_APPLICATION = "django_project.asgi.application"
TEMPLATES = []

postgres_settings = {
    "NAME": os.environ.get("DB_NAME", "").strip(),
    "USER": os.environ.get("DB_USER", "").strip(),
    "PASSWORD": os.environ.get("DB_PASSWORD", ""),
    "HOST": os.environ.get("DB_HOST", "127.0.0.1").strip(),
    "PORT": os.environ.get("DB_PORT", "5432").strip(),
}
missing_postgres_settings = [
    key for key in ("NAME", "USER", "PASSWORD") if not postgres_settings[key]
]
if missing_postgres_settings:
    raise ImproperlyConfigured(
        "Define DB_NAME, DB_USER y DB_PASSWORD en uciplays-backend/.env."
    )

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        **postgres_settings,
        "CONN_MAX_AGE": 0,
    }
}

LANGUAGE_CODE = "es"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
APPEND_SLASH = False

FRONTEND_ROOT = (
    REPOSITORY_ROOT
    / "proyecto-jump-frontend"
    / "JUMP (2)"
    / "JUMP"
    / "Project"
)
ASSET_ROOT = BASE_DIR / "public" / "assets"
IMAGE_ROOT = BASE_DIR / "img"
