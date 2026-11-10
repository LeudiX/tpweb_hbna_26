export default function CentroTable({ datos, onEditar, onEliminar, cargando }) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Centro</th>
            <th>Jefe</th>
            <th>Línea de Desarrollo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargando ? <tr><td colSpan="4" style={{textAlign:'center'}}>Cargando...</td></tr> : 
           datos.length === 0 ? <tr><td colSpan="4" style={{textAlign:'center'}}>No hay centros.</td></tr> : 
           datos.map((d) => (
            <tr key={d.id}>
              <td className="fw-semibold">{d.nombre}</td>
              <td>{d.jefe}</td>
              <td>{d.linea_desarrollo}</td>
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