import React from 'react';

export default function Event({ evento }) {
  return (
    <div className="evento-item-contenido">
      <span className="evento-titulo">{evento.title}</span>
      <span className="evento-lugar">📍 {evento.lugar}</span>
      <span className="evento-fecha">📆 {evento.fecha}</span>
    </div>
  );
}