import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerNoticiaPorId } from "../../services/noticiaService";
import "./noticia-detalle.css";

export default function NoticiaDetalle() {
  const { id } = useParams(); // Obtiene el ID de la URL, para poder mostrar la noticia que ha sido seleccionada.
  
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        setCargando(true);
        const datos = await obtenerNoticiaPorId(id);
        setNoticia(datos);
      } catch (err) {
        setError("No se pudo cargar la noticia. Puede que haya sido eliminada.");
      } finally {
        setCargando(false);
      }
    };

    cargarNoticia();
  }, [id]);

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  if (cargando) return <div className="detalle-estado">Cargando noticia...</div>;
  if (error) return <div className="detalle-estado error">{error}</div>;
  if (!noticia) return null;

  return (
    <article className="noticia-detalle">
      {/* Cabecera */}
      <header className="detalle-header">
        <Link to="/" className="detalle-volver">← Volver al inicio</Link>
        <span className="detalle-fecha">{formatearFecha(noticia.fecha)}</span>
        <h1 className="detalle-titulo">{noticia.titulo}</h1>
        
        {/* Mostramos el autor si viene en el JSON */}
        {noticia.autor_detalle && (
          <p className="detalle-autor">
            Por: <strong>{noticia.autor_detalle.first_name} {noticia.autor_detalle.last_name}</strong>
          </p>
        )}
      </header>

      {/* Imagen Principal */}
      <div className="detalle-imagen-contenedor">
        <img src={noticia.imagen} alt={noticia.titulo} className="detalle-imagen" />
      </div>

      {/* Contenido */}
      <div className="detalle-cuerpo">
        <p>{noticia.contenido}</p>
      </div>
    </article>
  );
}