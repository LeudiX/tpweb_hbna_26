
export default function ConsejoPage({
  datos,
  onEditar,
  onEliminar,
  cargando
}) {

  return (
    <div className="table-responsive">

      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {cargando ? (

            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Cargando miembros...
              </td>
            </tr>

          ) : datos.length === 0 ? (

            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay miembros del Consejo de Dirección.
              </td>
            </tr>

          ) : (

            datos.map((m) => (
              <tr key={m.id}>

                <td>
                  <img
                    src={m.foto}
                    alt={m.nombre}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                </td>

                <td className="fw-semibold">
                  {m.nombre}
                </td>

                <td>{m.correo}</td>

                <td>{m.cargo}</td>

                <td>
                  <div className="table-actions">

                    <button
                      type="button"
                      onClick={() => onEditar(m)}
                      className="btn-sm btn-outline-success"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onEliminar(m.id)}
                      className="btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>

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
