import { z } from "zod";
export const registroSchema = z.object({
  carnet_de_identidad: z.string().length(11, "El carnet debe tener al menos 11 caracteres").regex(/^[0-9]+$/, "El carnet solo debe tener números"),
  nombre_de_usuario: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  correo_electronico: z.string().email("El correo electrónico no es válido"),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmar_contrasena: z.string()
}).refine((data) => data.contrasena === data.confirmar_contrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmar_contrasena"], // El error se mostrará en este campo
})
rol: z.enum(["editor", "administrador"], {
  required_error: "Debe seleccionar un rol"
})