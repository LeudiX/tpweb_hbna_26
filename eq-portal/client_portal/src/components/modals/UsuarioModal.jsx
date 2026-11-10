import Modal from "./Modal"; 
import UsuarioForm from "../formularios/UsuarioForm"; 

export default function UsuarioModal({ isOpen, onClose, onGuardar, itemEditando, tipo }) {
  const esEditor = tipo === 'editores';
  
  // Definimos el título dinámico según el modo
  const titulo = itemEditando 
    ? `Editar ${esEditor ? 'Editor' : 'Administrador'}` 
    : `Nuevo ${esEditor ? 'Editor' : 'Administrador'}`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={titulo}
    >
      <UsuarioForm 
        onGuardar={onGuardar} 
        itemEditando={itemEditando} 
      />
      
      {/* Botón de cancelar (opcional, ya que el modal tiene la X) */}
      <button 
        onClick={onClose} 
        className="btn-outline" 
        style={{ marginTop: '1rem', width: '100%' }}
      >
        Cancelar
      </button>
    </Modal>
  );
}