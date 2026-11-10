import { useState, useEffect } from "react";
import { obtenerConsejo, crearConsejo, eliminarConsejo, actualizarConsejo} from "../../services/institucionalService";
import ConsejoForm from "../../components/formularios/ConsejoForm";
import ConsejoTable from "../../components/tablas/consejo/ConsejoTable";

export default function ConsejoAdminPage() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemEditando, setItemEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await obtenerConsejo();
      setDatos(res);
    } catch (error) { console.error(error); } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (formData) => {
    try {
      if (itemEditando) await actualizarConsejo(itemEditando.id, formData);
      else await crearConsejo(formData);
      setItemEditando(null); setIsModalOpen(false); cargar();
      return true;
    } catch (error) { alert("Error al guardar miembro"); return false; }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este miembro?")) return;
    await eliminarConsejo(id);
    cargar();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Gestión de Miembros del Consejo de Dirección</h1>
        <button onClick={() => { setItemEditando(null); setIsModalOpen(true); }} className="btn-success">+ Nuevo miembro</button>
      </div>

      <ConsejoTable datos={datos} onEditar={(d) => { setItemEditando(d); setIsModalOpen(true); }} onEliminar={handleEliminar} cargando={cargando} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>{itemEditando ? "Editar" : "Nuevo"} Miembro</h2>
            <ConsejoForm onGuardar={handleGuardar} itemEditando={itemEditando} />
            <button onClick={() => setIsModalOpen(false)} className="btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}