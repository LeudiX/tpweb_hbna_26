import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./side-bar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icono">🐊</span>
        <span className="sidebar-logo-texto">FTI Admin</span>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link activo">
          Panel Administrativo
        </Link>

        <Link to="/" className="sidebar-link">
          Ir a la página principal
        </Link>
        
      </nav>

      {/* Perfil del Usuario y Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-usuario">
          <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
          <div className="info">
            <span className="nombre">{user?.username || 'Usuario'}</span>
            <span className="rol">{user?.rol === 'admin' ? 'Administrador' : 'Editor'}</span>
          </div>
        </div>
        
        <button className="btn-logout-sidebar" onClick={() => { logout(); navigate('/login'); }}>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}