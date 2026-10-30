import { useState } from "react";

export default function UsuarioForm({ vistaActual, onGuardar }) {
  const [formData, setFormData] = useState({ username: "", email: "", ci: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData); // Le pasamos los datos al padre
    setFormData({ username: "", email: "", ci: "", password: "" }); // Limpiamos
  };

  const esEditor = vistaActual === 'editores';

  return (
    <section className="dashboard-card">
      <h2>Registrar Nuevo {esEditor ? 'Editor' : 'Administrador'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de Usuario</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
        </div>

        <div className="form-group">
          <label>Carnet de Identidad (CI)</label>
          <input type="text" name="ci" value={formData.ci} onChange={handleChange} className="form-control" required />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-success">
            Registrar {esEditor ? 'Editor' : 'Admin'}
          </button>
        </div>
      </form>
    </section>
  );
}