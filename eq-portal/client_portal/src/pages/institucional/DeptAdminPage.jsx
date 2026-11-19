import { useState, useEffect } from "react";
import { obtenerDepartamentos, 
  crearDepartamento, 
  eliminarDepartamento, 
  actualizarDepartamento,
  eliminarDepartamentosMasivo
} from "../../services/institucionalService";

import DepartamentoForm from "../../components/formularios/DepartamentoForm";
import DepartamentoTable from "../../components/tablas/departamento/DepartamentoTable";

export default function DepartamentosAdminPage() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemEditando, setItemEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await obtenerDepartamentos();
      setDatos(res);
      setSelectedIds([]); // Limpiamos la selección al recargar
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (formData) => {
    try {
      if (itemEditando) {
        await actualizarDepartamento(itemEditando.id, formData);
      } else {
        await crearDepartamento(formData);
      }
      setItemEditando(null);
      setIsModalOpen(false);
      cargar();
      return true;
    } catch (error) {
      alert("Error al guardar departamento");
      return false;
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este departamento?")) return;
    await eliminarDepartamento(id);
    cargar();
  };

  // NUEVA FUNCIÓN: Eliminar masivo
  const handleEliminarMasivo = async () => {
    if (!window.confirm(`¿Seguro que quieres eliminar ${selectedIds.length} departamentos?`)) return;
    try {
      await eliminarDepartamentosMasivo(selectedIds);
      cargar();
    } catch (error) {
      alert("Error al eliminar los departamentos.");
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Gestión de Departamentos</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
            {/* BOTÓN DE ELIMINAR MASIVO (Solo aparece si hay algo seleccionado) */}
            {selectedIds.length > 0 && (
              <button onClick={handleEliminarMasivo} className="btn-danger">
                Eliminar Seleccionados ({selectedIds.length})
              </button>
            )}
          
            <button onClick={() => { setItemEditando(null); setIsModalOpen(true); }} className="btn-success">
              + Nuevo Departamento
            </button>
          </div>
        </div>

      <DepartamentoTable 
        datos={datos} 
        onEditar={(d) => { setItemEditando(d); setIsModalOpen(true); }} 
        onEliminar={handleEliminar} 
        cargando={cargando}
        selectedIds={selectedIds}       // <-- Pasamos la selección
        setSelectedIds={setSelectedIds} // <-- Pasamos el modificador
      />      

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>{itemEditando ? "Editar" : "Nuevo"} Departamento</h2>
            <DepartamentoForm onGuardar={handleGuardar} itemEditando={itemEditando} />
            <button onClick={() => setIsModalOpen(false)} className="btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}