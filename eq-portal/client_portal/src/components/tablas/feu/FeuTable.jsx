export default function FEUTable({ datos, onEditar, onEliminar, cargando }) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Cargo</th>
            <th>Edad/Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargando ? <tr><td colSpan="4" style={{textAlign:'center'}}>Cargando...</td></tr> : 
           datos.length === 0 ? <tr><td colSpan="4" style={{textAlign:'center'}}>No hay miembros FEU.</td></tr> : 
           datos.map((d) => (
            <tr key={d.id}>
              <td className="fw-semibold">{d.nombre} {d.apellidos}</td>
              <td>{d.cargo}</td>
              <td>{d.edad} años - {d.ano_escolar}º año</td>
              <td>
                <div className="table-actions">
                  <button onClick={() => onEditar(d)} className="btn-sm btn-outline-success">Editar</button>
                  <button onClick={() => onEliminar(d.id)} className="btn-sm btn-outline-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}