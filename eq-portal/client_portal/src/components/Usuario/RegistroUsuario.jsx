
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registroSchema } from "./Validaciones";
import "./RegistroUsuario.css";

//Declaracion del componente
export default function RegistroUsuario({ onClose = () => {} }) {

  //Configuramos React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registroSchema),
  });

  // Función para registrar al usuario
  const onSubmit = async (data) => {

    console.log("Datos listos para enviar a Django:", data);

    /* Aquí irá la conexión con Django mediante POST */

  };

  // Estructura de la ventana emergente
  return (
    //indica que cuando se haga clic en este contenedor, se ejecutará la función para cerrar la ventana
    <div className="modal-overlay" onClick={onClose}>
  /*contiene el formulario y evitar que los clics realizados dentro de él cierren la ventana */

      <div
        className="modal-contenido"
        //cuadro de dialogo
        role="dialog"
        //se presenta sobre una pagina de contenido
        aria-modal="true"
        aria-labelledby="titulo-registro"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Botón para cerrar */}
        <button
          type="button"
          className="modal-cerrar"
          onClick={onClose}
          aria-label="Cancelar"
        >
          &times;
        </button>

        <div className="registro-card">

          <h2 id="titulo-registro" className="registro-titulo">
            Registrar usuario
          </h2>

          <p className="registro-descripcion">
            Ingrese los datos del usuario.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="registro-form"
          >

            {/* Campo: carnet de identidad */}
            <div className="form-grupo">
              <label htmlFor="carnet_de_identidad">
                Carnet de Identidad
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

            {/* Campo: contraseña */}
            <div className="form-grupo">
              <label htmlFor="contrasena">
                Contraseña
              </label>

              <input
                type="password"
                id="contrasena"
                {...register("contrasena")}
                className={errors.contrasena ? "input-error" : ""}
              />

              {errors.contrasena && (
                <span className="error-text">
                  {errors.contrasena.message}
                </span>
              )}
            </div>

            {/* Campo: confirmar contraseña */}
            <div className="form-grupo">
              <label htmlFor="confirmar_contrasena">
                Confirmar Contraseña
              </label>

              <input
                type="password"
                id="confirmar_contrasena"
                {...register("confirmar_contrasena")}
                className={errors.confirmar_contrasena ? "input-error" : ""}
              />

              {errors.confirmar_contrasena && (
                <span className="error-text">
                  {errors.confirmar_contrasena.message}
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

            {/* Botón de registro */}
            <button
              type="submit"
              className="btn-registro"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar usuario"}
            </button>
            {/* Botón cancelar */}
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
