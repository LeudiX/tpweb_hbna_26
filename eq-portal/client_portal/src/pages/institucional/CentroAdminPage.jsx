import { useState, useEffect } from "react";
import { obtenerCentros, crearCentro, eliminarCentro, actualizarCentro } from "../../services/institucionalService";
import CentroForm from "../../components/formularios/CentroForm";
import CentroTable from "../../components/tablas/centro/CentroTable";

export default function CentrosAdminPage() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemEditando, setItemEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await obtenerCentros();
      setDatos(res);
    } catch (error) { console.error(error); } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (formData) => {
    try {
      if (itemEditando) await actualizarCentro(itemEditando.id, formData);
      else await crearCentro(formData);
      setItemEditando(null); setIsModalOpen(false); cargar();
      return true;
    } catch (error) { alert("Error al guardar centro"); return false; }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este centro?")) return;
    await eliminarCentro(id);
    cargar();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Gestión de Centros de Desarrollo</h1>
        <button onClick={() => { setItemEditando(null); setIsModalOpen(true); }} className="btn-success">+ Nuevo Centro</button>
      </div>

      <CentroTable datos={datos} onEditar={(d) => { setItemEditando(d); setIsModalOpen(true); }} onEliminar={handleEliminar} cargando={cargando} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>{itemEditando ? "Editar" : "Nuevo"} Centro</h2>
            <CentroForm onGuardar={handleGuardar} itemEditando={itemEditando} />
            <button onClick={() => setIsModalOpen(false)} className="btn-outline" style={{ marginTop: '1rem', width: '100%'  }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}