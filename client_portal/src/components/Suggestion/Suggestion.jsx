import { useState } from "react";
import "./suggestion.css";

export default function SuggestionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ nombre: "", correo: "", comentario: "" });
  const [enviado, setEnviado] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí luego conectarás con tu API de Django (POST)
    console.log("Sugerencia enviada:", formData);
    
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: "", correo: "", comentario: "" }); // Limpiar
      onClose(); // Cerrar modal
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Detenemos la propagación para que al hacer clic dentro del modal no se cierre */}
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">✕</button>
        
        {!enviado ? (
          <>
            <h2 className="modal-titulo">Buzón de Sugerencias</h2>
            <p className="modal-descripcion">Tu opinión nos ayuda a mejorar. Déjanos tus comentarios.</p>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grupo">
                <label htmlFor="nombre">Nombre completo</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-grupo">
                <label htmlFor="correo">Correo electrónico</label>
                <input 
                  type="email" 
                  id="correo" 
                  name="correo" 
                  value={formData.correo} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-grupo">
                <label htmlFor="comentario">Comentario o sugerencia</label>
                <textarea 
                  id="comentario" 
                  name="comentario" 
                  rows="4" 
                  value={formData.comentario} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              
              <button type="submit" className="btn-enviar">Enviar sugerencia</button>
            </form>
          </>
        ) : (
          <div className="mensaje-exito">
            <span className="icono-exito">✓</span>
            <h3>¡Gracias por tu sugerencia!</h3>
            <p>La hemos recibido correctamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}