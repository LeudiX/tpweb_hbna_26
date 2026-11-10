import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(3, "Nombre obligatorio"),
  apellidos: z.string().min(3, "Apellidos obligatorios"),
  ano_escolar: z.string().regex(/^\d+$/, "Debe ser un número"),
  edad: z.string().regex(/^\d+$/, "Debe ser un número"),
  cargo: z.string().min(3, "Cargo obligatorio"),
  biografia: z.string().min(10, "La biografía es obligatoria"),
});

export default function FEUForm({ onGuardar, itemEditando }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: itemEditando || {}
  });

  return (
    <form onSubmit={handleSubmit(onGuardar)}>
      <div className="form-group">
        <label>Nombre</label>
        <input type="text" {...register("nombre")} className="form-control" />
        {errors.nombre && <span className="error-text">{errors.nombre.message}</span>}
      </div>
      <div className="form-group">
        <label>Apellidos</label>
        <input type="text" {...register("apellidos")} className="form-control" />
        {errors.apellidos && <span className="error-text">{errors.apellidos.message}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Año Escolar</label>
          <input type="number" {...register("ano_escolar")} className="form-control" />
          {errors.ano_escolar && <span className="error-text">{errors.ano_escolar.message}</span>}
        </div>
        <div className="form-group">
          <label>Edad</label>
          <input type="number" {...register("edad")} className="form-control" />
          {errors.edad && <span className="error-text">{errors.edad.message}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Cargo</label>
        <input type="text" {...register("cargo")} className="form-control" />
        {errors.cargo && <span className="error-text">{errors.cargo.message}</span>}
      </div>
      <div className="form-group">
        <label>Biografía</label>
        <textarea {...register("biografia")} className="form-control" rows="3"></textarea>
        {errors.biografia && <span className="error-text">{errors.biografia.message}</span>}
      </div>
      <button type="submit" className="btn-success" style={{ marginTop: '1rem', width: "100%" }}>
        {itemEditando ? "Guardar Cambios" : "Agregar Miembro FEU"}
      </button>
    </form>
  );
}