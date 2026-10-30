import DashboardTabs from "../dashboard/DashBoardTabs";
import UsuarioForm from "../../components/formularios/UsuarioForm";
import UsuariosTable from "../../components/tablas/tablaUsuarios/tablaUsuario";
import "./dashboard.css";
import Sidebar from "../dashboard/SideBar";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import { 
  obtenerEditores, crearEditor, eliminarEditor,
  obtenerAdministradores, crearAdministrador, eliminarAdministrador
} from "../../services/usuarioService";

export default function Dashboard() {
  const { user } = useAuth();
  
  const [vistaActual, setVistaActual] = useState('editores');
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setErrorMsg("");
      const datos = vistaActual === 'editores' 
        ? await obtenerEditores() 
        : await obtenerAdministradores();
      setUsuarios(datos);
    } catch (error) {
      setErrorMsg(`No se pudieron cargar los ${vistaActual}. Verifica tus permisos.`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [vistaActual]);

  const handleGuardar = async (formData) => {
    setErrorMsg("");
    try {
      if (vistaActual === 'editores') {
        await crearEditor(formData);
      } else {
        await crearAdministrador(formData);
      }
      cargarDatos(); 
    } catch (error) {
      setErrorMsg(error.response?.data?.username?.[0] || "Error al crear el usuario. Revisa los datos.");
    }
  };

  const handleEliminar = async (ci) => {
    if (!window.confirm(`¿Seguro que quieres eliminar a este registro?`)) return;
    try {
      if (vistaActual === 'editores') {
        await eliminarEditor(ci);
      } else {
        await eliminarAdministrador(ci);
      }
      cargarDatos();
    } catch (error) {
      alert("No se pudo eliminar. Puede que tenga registros asociados.");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* BARRA LATERAL */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          <header className="dashboard-header">
            <p className="dashboard-eyebrow">Administración</p>
            <h1 className="dashboard-title">Panel de Administración</h1>
            <p className="dashboard-subtitle">
              Bienvenido de nuevo, <strong>{user?.username || 'Usuario'}</strong>.
            </p>
          </header>

          {errorMsg && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{errorMsg}</div>}

          <DashboardTabs vistaActual={vistaActual} onChangeVista={setVistaActual} />

          <div className="dashboard-grid">
            <UsuarioForm vistaActual={vistaActual} onGuardar={handleGuardar} />
            <UsuariosTable 
              usuarios={usuarios} 
              vistaActual={vistaActual} 
              onEliminar={handleEliminar} 
              currentUsername={user?.username}
              cargando={cargando}
            />
          </div>

        </div>
      </main>
    </div>
  );
}