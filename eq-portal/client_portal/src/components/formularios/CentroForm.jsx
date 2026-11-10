import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(3, "Mínimo 3 letras"),
  jefe: z.string().min(3, "El jefe es obligatorio"),
  linea_desarrollo: z.string().min(3, "Línea de desarrollo obligatoria"),
  principales_productos: z.string().min(5, "Describa los productos"),
});

export default function CentroForm({ onGuardar, itemEditando }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: itemEditando || {}
  });

  return (
    <form onSubmit={handleSubmit(onGuardar)}>
      <div className="form-group">
        <label>Nombre del Centro</label>
        <input type="text" {...register("nombre")} className="form-control" />
        {errors.nombre && <span className="error-text">{errors.nombre.message}</span>}
      </div>
      <div className="form-group">
        <label>Jefe del Centro</label>
        <input type="text" {...register("jefe")} className="form-control" />
        {errors.jefe && <span className="error-text">{errors.jefe.message}</span>}
      </div>
      <div className="form-group">
        <label>Línea de Desarrollo</label>
        <input type="text" {...register("linea_desarrollo")} className="form-control" />
        {errors.linea_desarrollo && <span className="error-text">{errors.linea_desarrollo.message}</span>}
      </div>
      <div className="form-group">
        <label>Principales Productos</label>
        <textarea {...register("principales_productos")} className="form-control" rows="3"></textarea>
        {errors.principales_productos && <span className="error-text">{errors.principales_productos.message}</span>}
      </div>
      <button type="submit" className="btn-success" style={{ marginTop: '1rem', width: "100%" }}>
        {itemEditando ? "Guardar Cambios" : "Crear Centro"}
      </button>
    </form>
  );
}