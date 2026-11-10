
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validaciones de los campos
const schema = z.object({
  nombre: z.string().trim().min(3, "El nombre es obligatorio"),
  correo: z.string().trim().email("Correo inválido"),
  cargo: z.string().trim().min(3, "El cargo es obligatorio"),
});

export default function ConsejoForm({ onGuardar, itemEditando }) {

  // Estado para almacenar la fotografía seleccionada
  const [foto, setFoto] = useState(null);
  const [errorFoto, setErrorFoto] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      correo: "",
      cargo: ""
    }
  });

  // Cargar los datos cuando se selecciona un miembro para modificar
  useEffect(() => {
    reset({
      nombre: itemEditando?.nombre || "",
      correo: itemEditando?.correo || "",
      cargo: itemEditando?.cargo || ""
    });

    setFoto(null);
    setErrorFoto("");

  }, [itemEditando, reset]);

  // Enviar los datos del formulario
  const submit = async (data) => {

    // La foto es obligatoria al registrar un nuevo miembro
    if (!itemEditando && !foto) {
      setErrorFoto("Debe seleccionar una fotografía");
      return;
    }

    const resultado = await onGuardar(data, foto);

    if (!resultado) {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>

      {/* Nombre */}
      <div className="form-group">
        <label>Nombre completo</label>

        <input
          type="text"
          {...register("nombre")}
          className="form-control"
        />

        {errors.nombre && (
          <span className="error-text">
            {errors.nombre.message}
          </span>
        )}
      </div>

      {/* Cargo */}
      <div className="form-group">
        <label>Cargo</label>

        <input
          type="text"
          {...register("cargo")}
          className="form-control"
        />

        {errors.cargo && (
          <span className="error-text">
            {errors.cargo.message}
          </span>
        )}
      </div>

      {/* Correo */}
      <div className="form-group">
        <label>Correo electrónico</label>

        <input
          type="email"
          {...register("correo")}
          className="form-control"
        />

        {errors.correo && (
          <span className="error-text">
            {errors.correo.message}
          </span>
        )}
      </div>

      {/* Fotografía */}
      <div className="form-group">
        <label>Fotografía de perfil</label>

        {itemEditando?.foto && !foto && (
          <div style={{ marginBottom: "1rem" }}>
            <img
              src={itemEditando.foto}
              alt="Fotografía actual"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
            <p>Fotografía actual</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => {
            setFoto(e.target.files?.[0] || null);
            setErrorFoto("");
          }}
        />

        {foto && (
          <p style={{ fontSize: "0.85rem" }}>
            Archivo seleccionado: {foto.name}
          </p>
        )}

        {errorFoto && (
          <span className="error-text">
            {errorFoto}
          </span>
        )}
      </div>

      {/* Botón de guardar */}
      <button
        type="submit"
        className="btn-success"
        style={{ marginTop: "1rem", width: "100%" }}
      >
        {itemEditando ? "Guardar cambios" : "Agregar miembro"}
      </button>

    </form>
  );
}
