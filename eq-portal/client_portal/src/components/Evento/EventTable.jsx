import React from 'react';
import DataTable from 'react-data-table-component';
import Event from './Event';
import './event-table.css';

// Columnas de la tabla
const columnas = [
  {
    name: 'Evento',
    selector: row => row.title,
    sortable: true,
    grow: 2, // La columna del evento ocupa más espacio
  },
  {
    name: 'Lugar',
    selector: row => row.lugar,
    sortable: true,
    hide: 'sm', // Ocultar en pantallas pequeñas
  },
  {
    name: 'Fecha',
    selector: row => row.fecha,
    sortable: true,
    width: '150px',
  },
];

// Estilos personalizados para el modo oscuro
const customStyles = {
  table: {
    style: {
      backgroundColor: 'transparent',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
    },
  },
  headCells: {
    style: {
      color: '#6ee7b7',
      fontWeight: '700',
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  rows: {
    style: {
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      '&:hover': {
        backgroundColor: '#1e293b',
      },
    },
  },
  cells: {
    style: {
      padding: '1rem',
    },
  },
};

// Componente principal de la tabla de eventos que recibe los eventos como props
export default function EventTable({ eventos }) {
  return (
    <div className="agenda-table-wrapper">
      <DataTable
        columns={columnas}
        data={eventos}
        customStyles={customStyles}
        noHeader
        dense
        pagination={false}
        theme="dark"
        responsive
      />
    </div>
  );
}