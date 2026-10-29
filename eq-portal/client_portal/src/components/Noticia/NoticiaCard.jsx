import { Link } from "react-router-dom";
import "./noticia-card.css";

// Función para formatear la fecha (Ej: "24 Oct 2026")
function formatearFecha(fechaString) {
  const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(fechaString).toLocaleDateString('es-ES', opciones);
}

export default function NoticiaCard({ noticia, destacada = false }) {
  return (
    <article className={`noticia-card ${destacada ? "noticia-card-destacada" : ""}`}>
      {/* Imagen de la noticia */}
      <div className="noticia-card-imagen-contenedor">
        <img 
          src={noticia.imagen} 
          alt={`Imagen de: ${noticia.titulo}`} 
          className="noticia-card-imagen" 
          loading="lazy" // Buena práctica para que cargue rápido
        />
      </div>

      {/* Contenido de la noticia */}
      <div className="noticia-card-contenido">
        <span className="noticia-card-fecha">{formatearFecha(noticia.fecha)}</span>
        
        <h3 className="noticia-card-titulo">{noticia.titulo}</h3>
        
        <p className="noticia-card-extracto">{noticia.contenido}</p>
        
        {/* Enlace para leer más (usando Link de React Router) */}
        <Link to={noticia.enlace} className="noticia-card-boton">
          Continuar leyendo <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}