# UCI Plays

Aplicación para gestionar eventos deportivos universitarios, participantes, resultados, sanciones y ranking por facultad.

## Stack activo

- **Backend:** Python y Django 5.2; expone la API bajo `/api` y sirve el sitio bajo `/jump`.
- **Base de datos:** PostgreSQL, conectado mediante `psycopg`.
- **Frontend:** HTML, CSS y JavaScript nativo que se ejecuta en el navegador. El JavaScript actual llama a la API de Django con `fetch` y actualiza la interfaz.
- **Librerías de interfaz:** Chart.js para gráficos y jsPDF para exportar documentos.
- **Autenticación:** tokens JWT y contraseñas con hash bcrypt.

No se necesita Node.js para arrancar la aplicación. El `package.json` de la raíz se conserva únicamente para las herramientas opcionales de ESLint.

## Requisitos y configuración

- Python 3.10 a 3.14.
- Una base de datos PostgreSQL.
- Las dependencias de `uciplays-backend/requirements.txt`.

Copia `uciplays-backend/.env.example` a `uciplays-backend/.env` y configura `JWT_SECRET`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`. También puedes ajustar `DB_HOST` y `DB_PORT`. Si ya hay una instalación, conserva el valor de `JWT_SECRET` para que los tokens existentes sigan verificándose.

## Arranque en Windows

Desde `uciplays-backend`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Antes de aplicar migraciones a una base existente, crea un respaldo PostgreSQL con `pg_dump`. Si la base ya tiene las tablas de la migración inicial, registra esa migración con:

```powershell
python manage.py migrate --fake-initial
```

Para una base nueva y vacía, ejecuta `python manage.py migrate` sin `--fake-initial`; las migraciones inicializan las tablas y los datos de ejemplo. Después inicia Django:

```powershell
python manage.py runserver 0.0.0.0:4000
```

Abre <http://localhost:4000/jump/>. Para crear una cuenta administradora, ejecuta `python manage.py create_admin`; el comando solicita usuario y contraseña.

La opción de respaldo del panel descarga una exportación JSON de los datos administrados por la aplicación. Para un respaldo completo de PostgreSQL, usa `pg_dump`.

## API

- `GET /api/ranking`
- `GET`, `POST /api/facultades`; `GET`, `PUT`, `DELETE /api/facultades/:id`
- `GET`, `POST /api/eventos`; `GET`, `PUT`, `DELETE /api/eventos/:id`
- `POST /api/eventos/:id/iniciar` y `POST /api/eventos/:id/resultado`
- `GET`, `POST /api/deportes`; `PUT`, `DELETE /api/deportes/:id`
- `GET`, `POST /api/equipos`; `PUT`, `DELETE /api/equipos/:id`
- `GET`, `POST /api/integrantes`; `GET /api/integrantes/:equipo_id`; `PUT`, `DELETE /api/integrantes/:id`
- `GET`, `POST /api/sanciones`; `DELETE /api/sanciones/:id`
- `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`
- `GET /api/auditoria` y `GET /api/backup` para administradores

Las lecturas de datos son públicas. Las operaciones de escritura requieren `Authorization: Bearer <token>`. El frontend mantiene el token en `localStorage`.

## Estructura principal

```text
uciplays-backend/
├── manage.py
├── requirements.txt
├── django_project/       configuración y rutas de Django
└── sports/               modelos, API, autenticación y migraciones
proyecto-jump-frontend/
└── JUMP (2)/JUMP/Project/ sitio HTML, CSS y JavaScript
```
