import React from 'react';
import "./premio.css";

// Componente principal que representa un premio o logro se le envía por param etros la imagen, el texto del badge, el título, la descripción y la información de eSports.
export default function BentoPrincipal({ 
  imagen, 
  altImagen, 
  textoBadge, 
  titulo, 
  descripcion, 
  infoEsports 
}) {
  return (
    <div className="bento-card bento-principal">
      
      {/* Imagen superior con gradiente y badge */}
      <div className="imagen-contenedor">
        <img src={imagen} alt={altImagen} />
        <div className="imagen-gradiente"></div>
        {textoBadge && (
          <span className="badge-campeon">{textoBadge}</span>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="contenido">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>

        {/* Bloque resaltado de eSports */}
        {infoEsports && (
          <div className="info-esports">
            <p>{infoEsports}</p>
          </div>
        )}
      </div>

    </div>
  );
}