export default function DashboardTabs({ vistaActual, onChangeVista }) {
  return (
    <div className="dashboard-tabs">
      <button 
        className={`btn-tab ${vistaActual === 'editores' ? 'activo' : ''}`}
        onClick={() => onChangeVista('editores')}
      >
        Gestionar Editores
      </button>
      
      <button 
        className={`btn-tab ${vistaActual === 'admins' ? 'activo' : ''}`}
        onClick={() => onChangeVista('admins')}
      >
        Gestionar Administradores
      </button>
    </div>
  );
}