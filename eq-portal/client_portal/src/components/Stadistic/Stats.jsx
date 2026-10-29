import "./stats.css";

export default function StatsBanner({ estadisticas }) {
  // Si no se pasan estadísticas, no renderizamos nada
  if (!estadisticas || estadisticas.length === 0) return null;

  return (
    <div className="stats-banner">
      <div className="stats-banner-contenedor">
        {estadisticas.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-numero">{stat.numero}</span>
            <span className="stat-texto">{stat.texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

