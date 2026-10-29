import { Link } from "react-router-dom"
import "./not-found.css"

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página no encontrada</h2>
        <p className="not-found-text">
          Lo sentimos, la página que estás buscando no existe o fue movida de lugar.
        </p>

        {/* Botón para volver al inicio */}
        <Link to="/" className="not-found-btn">
          Volver al inicio
        </Link>

      </div>
    </div>
  );
}