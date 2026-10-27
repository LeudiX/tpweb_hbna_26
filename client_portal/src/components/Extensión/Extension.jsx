import { useState } from "react";
import Esfera from "./Esfera";
import "./extension.css";
import Premio from "./Premio";
import EventTable from "../Evento/EventTable";

// Datos para la tarjeta principal de los Mellas
const datosCaimanesPremio = {
  imagen: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
  altImagen: "Afición Caimán en el estadio",
  textoBadge: "Campeones Juegos Deportivos Mella 2023-2024",
  titulo: "Caimanes: Pasión por la Competencia y la Hermandad",
  descripcion: "Partidos complicados y victorias memorables. La comunidad Caimán se une en torno a la emoción de los deportes, celebrando cada logro y fomentando la camaradería entre estudiantes.",
  infoEsports: "Deportes destacados: La facultad cuenta con escuadras oficiales de Fútubol, Básquetbol y Voleibol que compiten en ligas universitarias."
};

const eventos = [
  { id: 1, title: 'Torneo eSports Caimán 2026', fecha: '15 Noviembre', lugar: 'Arena Polivalente UCI', tag: 'eSports' },
  { id: 2, title: 'Hackathon Game Jam 48H', fecha: '28-30 Noviembre', lugar: 'Laboratorios 401-404', tag: 'Game Dev' },
  { id: 3, title: 'Taller Comunitario de Robótica', fecha: '05 Diciembre', lugar: 'Escuela La Lisa', tag: 'Extensión' }
];

export default function VidaEstudiantil() {
  // Estado para manejar qué filtro está seleccionado
  const [ejeSeleccionado, setEjeSeleccionado] = useState('todos');

  return (
    <section id="extension" className="vida-estudiantil">
      <div className="vida-contenedor">
        
        {/* Cabecera Principal */}
        <div className="vida-header">
          
          {/* Textos */}
          <div className="vida-header-textos">
            <p className="ex-etiqueta-seccion">02 — Vida Estudiantil y Extensión</p>
            <h2 className="vida-titulo">Vida Estudiantil y Extensión</h2>
            <p className="vida-descripcion">
              Más allá del código: torneos de deportes electrónicos, maratones de desarrollo, arte digital y acción comunitaria. Descubre los diferentes ejes en los que se desenvuelve la comunidad Caimán.
            </p>
          </div>

          {/* Componente de Filtros */}
          <Esfera
            ejeActual={ejeSeleccionado} 
            alSeleccionar={setEjeSeleccionado} 
          />
        </div>

        {/* Premio Mella */}
        <section className="premio-mella">
          <Premio {...datosCaimanesPremio} />
        </section>

        {/* Agenda de eventos*/}
        <section className="agenda">
          <h3 className="agenda-titulo">Agenda de Eventos</h3>
          <EventTable eventos={eventos} />
        </section>

        {/* AQUÍ IREMOS AGREGANDO LAS TARJETAS EN LOS SIGUIENTES PASOS */}
        <div style={{ marginTop: '3rem', padding: '2rem', border: '1px dashed #34d399', textAlign: 'center', borderRadius: '12px', color: '#94a3b8' }}>
          [Aquí irán las tarjetas Bento y la Agenda en el siguiente paso]
          <br />
          Filtro actual seleccionado: <strong>{ejeSeleccionado}</strong>
        </div>

      </div>
    </section>
  );
}