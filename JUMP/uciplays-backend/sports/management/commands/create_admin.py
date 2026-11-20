import getpass

import bcrypt
from django.core.management.base import BaseCommand, CommandError

from sports.models import Usuario


class Command(BaseCommand):
    help = "Crea un usuario administrador en la tabla usuarios existente."

    def handle(self, *args, **options):
        username = input("Usuario administrador: ").strip()
        if not username:
            raise CommandError("El usuario no puede estar vacío.")

        password = getpass.getpass("Contraseña (mínimo 12 caracteres): ")
        confirmation = getpass.getpass("Repite la contraseña: ")
        if len(password) < 12:
            raise CommandError("La contraseña debe tener al menos 12 caracteres.")
        if len(password.encode("utf-8")) > 72:
            raise CommandError("La contraseña no puede superar 72 bytes en UTF-8.")
        if password != confirmation:
            raise CommandError("Las contraseñas no coinciden.")
        if Usuario.objects.filter(username=username).exists():
            raise CommandError(f'Ya existe una cuenta con el usuario "{username}".')

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt(rounds=12)
        ).decode("utf-8")
        Usuario.objects.create(
            username=username,
            password_hash=password_hash,
            rol="admin",
            activo=True,
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'Administrador "{username}" creado. Ya puedes iniciar sesión en el panel.'
            )
        )
