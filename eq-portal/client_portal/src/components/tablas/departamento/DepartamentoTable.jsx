export default function DepartamentoTable({ datos, onEditar, onEliminar, cargando, selectedIds, setSelectedIds }) {
  
  // Lógica para seleccionar/deseleccionar todos
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(datos.map(d => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Lógica para seleccionar/deseleccionar una fila
  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            {/* Checkbox de "Seleccionar Todo" */}
            <th style={{ width: '40px' }}>
              <input 
                type="checkbox" 
                onChange={handleSelectAll} 
                checked={datos.length > 0 && selectedIds.length === datos.length}
              />
            </th>
            <th>Departamento</th>
            <th>Jefe</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Cargando...</td></tr>
          ) : datos.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay departamentos.</td></tr>
          ) : (
            datos.map((d) => (
              <tr key={d.id}>
                {/* Checkbox individual */}
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(d.id)} 
                    onChange={() => handleSelectRow(d.id)}
                  />
                </td>
                <td className="fw-semibold">{d.nombre}</td>
                <td>{d.jefe}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => onEditar(d)} className="btn-sm btn-outline-success">Editar</button>
                    <button onClick={() => onEliminar(d.id)} className="btn-sm btn-outline-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}