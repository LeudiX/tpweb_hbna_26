
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registroSchema } from "./ValidacionesModificar";
import "./ModificarUsuario.css";

export default function ModificarUsuario({ usuario, onClose = () => {} }) {

  //Configuramos React Hook Form con Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registroSchema),
  });

  //Cargamos los datos actuales del usuario
  useEffect(() => {
    if (usuario) {
      reset({
        carnet_de_identidad: usuario.carnet_de_identidad,
        nombre_de_usuario: usuario.nombre_de_usuario,
        correo_electronico: usuario.correo_electronico,
        rol: usuario.rol,
      });
    }
  }, [usuario, reset]);

  //Función para guardar los cambios
  const onSubmit = async (data) => {

    console.log("Datos modificados:", data);

    /* Aquí realizaremos la petición PATCH a Django
       para actualizar la información del usuario. */

  };

  //Ventana emergente
  return (
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="modal-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modificar"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Botón para cerrar */}
        <div className="registro-card">

          <h2
            id="titulo-modificar"
            className="registro-titulo"
          >
            Modificar usuario
          </h2>

          <p className="registro-descripcion">
            Actualice los datos del usuario.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="registro-form"
          >

            {/* Campo: carnet de identidad */}
            <div className="form-grupo">
              <label htmlFor="carnet_de_identidad">
                Carnet de identidad
              </label>

              <input
                type="text"
                id="carnet_de_identidad"
                {...register("carnet_de_identidad")}
                className={errors.carnet_de_identidad ? "input-error" : ""}
              />

              {errors.carnet_de_identidad && (
                <span className="error-text">
                  {errors.carnet_de_identidad.message}
                </span>
              )}
            </div>

            {/* Campo: nombre de usuario */}
            <div className="form-grupo">
              <label htmlFor="nombre_de_usuario">
                Nombre de usuario
              </label>

              <input
                type="text"
                id="nombre_de_usuario"
                {...register("nombre_de_usuario")}
                className={errors.nombre_de_usuario ? "input-error" : ""}
              />

              {errors.nombre_de_usuario && (
                <span className="error-text">
                  {errors.nombre_de_usuario.message}
                </span>
              )}
            </div>

            {/* Campo: correo electrónico */}
            <div className="form-grupo">
              <label htmlFor="correo_electronico">
                Correo electrónico
              </label>

              <input
                type="email"
                id="correo_electronico"
                {...register("correo_electronico")}
                className={errors.correo_electronico ? "input-error" : ""}
              />

              {errors.correo_electronico && (
                <span className="error-text">
                  {errors.correo_electronico.message}
                </span>
              )}
            </div>

            {/* Campo: rol */}
            <div className="form-grupo">
              <label>Rol</label>

              <div className="opciones-rol">

                <label>
                  <input
                    type="radio"
                    value="editor"
                    {...register("rol")}
                  />
                  Editor
                </label>

                <label>
                  <input
                    type="radio"
                    value="administrador"
                    {...register("rol")}
                  />
                  Administrador
                </label>

              </div>

              {errors.rol && (
                <span className="error-text">
                  {errors.rol.message}
                </span>
              )}
            </div>

            {/* Botón: guardar cambios */}
            <button
              type="submit"
              className="btn-registro"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>

            {/* Botón: cancelar */}
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
            >
              Cancelar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
