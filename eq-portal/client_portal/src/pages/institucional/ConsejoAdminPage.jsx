
import { useState, useEffect, useCallback } from "react";

// Servicios para gestionar los miembros del Consejo
import {
  obtenerConsejo,
  crearConsejo,
  actualizarConsejo,
  eliminarConsejo
} from "../../services/institucionalService";

// Componentes que utiliza el panel administrativo
import ConsejoForm from "../../components/formularios/ConsejoForm";
import ConsejoPage from "../../components/tablas/consejo/ConsejoPage";

export default function ConsejoAdminPage() {

  // Estados del componente
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemEditando, setItemEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Cargar los miembros del Consejo de Direccion
  const cargar = useCallback(async () => {
    try {
      setCargando(true);

      const res = await obtenerConsejo();

      setDatos(res);

    } catch (error) {
      console.error("Error al cargar los miembros:", error);
      alert("No se pudieron cargar los miembros del Consejo.");
    } finally {
      setCargando(false);
    }
  }, []);


  // Ejecutar la consulta cuando se muestra la página
  useEffect(() => {
    cargar();
  }, [cargar]);


  // Registar o modificar un miembro del Consejo de Direccion
  const handleGuardar = async (datosFormulario, imagenFile) => {
    try {

      if (itemEditando) {

        // Modificar el miembro seleccionado
        await actualizarConsejo(
          itemEditando.id,
          datosFormulario,
          imagenFile
        );

        alert("Se ha realizado la modificación satisfactoriamente");

      } else {

        // Registrar un nuevo miembro
        await crearConsejo(
          datosFormulario,
          imagenFile
        );

        alert("Se han ingresado satisfactoriamente los datos");
      }

      // Limpiar el miembro seleccionado
      setItemEditando(null);

      // Cerrar el formulario
      setIsModalOpen(false);

      // Actualizar la tabla
      await cargar();

      return true;

    } catch (error) {
      console.error(
        "Error al guardar miembro:",
        error.response?.data || error
      );

      alert("No se pudieron guardar los datos. Compruebe los campos.");

      return false;
    }
  };


  // Eliminar un miembro del Consejo de Direccion
  const handleEliminar = async (id) => {

    const confirmar = window.confirm(
      "¿Está seguro de que desea eliminar este miembro del Consejo?"
    );

    // Cancelar la operación si el usuario no confirma
    if (!confirmar) {
      return;
    }

    try {

      await eliminarConsejo(id);

      alert("Eliminación satisfactoria");

      // Actualizar la tabla después de eliminar
      await cargar();

    } catch (error) {
      console.error("Error al eliminar miembro:", error);
      alert("No se pudo eliminar el miembro.");
    }
  };


  // Abrir el formulario para registrar un miembro nuevo
  const abrirNuevo = () => {
    setItemEditando(null);
    setIsModalOpen(true);
  };


  // Abrir el formulario para modificar un miembro
  const abrirEdicion = (miembro) => {
    setItemEditando(miembro);
    setIsModalOpen(true);
  };


  // Cerrar el formulario
  const cerrarModal = () => {
    setIsModalOpen(false);
    setItemEditando(null);
  };


  // Mostrar el panel administrativo
  return (
  <div className="consejo-admin-page">

    {/* Encabezado del panel */}
    <div className="consejo-admin-encabezado">

      <h1 className="consejo-admin-titulo">
        Gestión del Consejo de Dirección
      </h1>

      <button
        type="button"
        onClick={abrirNuevo}
        className="consejo-admin-btn-nuevo"
      >
        + Nuevo miembro
      </button>

    </div>

    {/* Contenedor horizontal de la tabla */}
    <div className="consejo-admin-tabla-contenedor">

      <ConsejoPage
        datos={datos}
        onEditar={abrirEdicion}
        onEliminar={handleEliminar}
        cargando={cargando}
      />

    </div>

    {/* Ventana modal del formulario */}
    {isModalOpen && (

      <div
        className="modal-overlay"
        onClick={cerrarModal}
      >

        <div
          className="modal-contenido"
          onClick={(e) => e.stopPropagation()}
        >

          <h2>
            {itemEditando
              ? "Modificar miembro"
              : "Registrar miembro"}
          </h2>

          <ConsejoForm
            onGuardar={handleGuardar}
            itemEditando={itemEditando}
          />

          <button
            type="button"
            onClick={cerrarModal}
            className="btn-outline consejo-admin-btn-cancelar"
          >
            Cancelar
          </button>

        </div>

      </div>

    )}

  </div>
);

}
