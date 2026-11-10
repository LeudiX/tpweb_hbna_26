import { useState, useEffect } from "react";
import { crearFeu, eliminarFeu, actualizarFeu, obtenerFeu } from "../../services/institucionalService";
import FeuForm from "../../components/formularios/FeuForm";
import FeuTable from "../../components/tablas/feu/FeuTable";

export default function FeuAdminPage() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemEditando, setItemEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await obtenerFeu();
      setDatos(res);
    } catch (error) { console.error(error); } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (formData) => {
    try {
      if (itemEditando) await actualizarFeu(itemEditando.id, formData);
      else await crearFeu(formData);
      setItemEditando(null); setIsModalOpen(false); cargar();
      return true;
    } catch (error) { alert("Error al guardar secretario"); return false; }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este miembro?")) return;
    await eliminarFeu(id);
    cargar();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Gestión de miembros del secretariado de la FEU</h1>
        <button onClick={() => { setItemEditando(null); setIsModalOpen(true); }} className="btn-success">+ Nuevo Secretario de la FEU</button>
      </div>

      <FeuTable datos={datos} onEditar={(d) => { setItemEditando(d); setIsModalOpen(true); }} onEliminar={handleEliminar} cargando={cargando} />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>{itemEditando ? "Editar" : "Nuevo"} Secretario</h2>
            <FeuForm onGuardar={handleGuardar} itemEditando={itemEditando} />
            <button onClick={() => setIsModalOpen(false)} className="btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}