import React from 'react';
import "./esfera.css";

// Definimos los ejes disponibles
const EJES = [
  { id: 'todos', label: 'Todos los Ejes' },
  { id: 'esports', label: 'eSports' },
  { id: 'hackathon', label: 'Game Jams' },
  { id: 'extension', label: 'Extensión' }
];

export default function FiltrosVida({ ejeActual, alSeleccionar }) {
  return (
    <div className="filtros-grupo">
      {EJES.map((eje) => (
        <button
          key={eje.id}
          className={`filtro-btn ${ejeActual === eje.id ? 'activo' : ''}`}
          onClick={() => alSeleccionar(eje.id)}
        >
          {eje.label}
        </button>
      ))}
    </div>
  );
}