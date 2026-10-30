import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import "./login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Para cmabiar entre Login y Registro
  const [formData, setFormData] = useState({ username: "", password: "", email: "", ci: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (isLogin) {
        // Intentar iniciar sesión
        const exito = await login(formData.username, formData.password);
        if (!exito) setError("Credenciales incorrectas. Verifica tu usuario y contraseña.");
      } else {
        // Registrarse (Por defecto creamos un Editor)
        await apiClient.post('/usuarios/editores/', {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          ci: formData.ci
        });
        // Si el registro es exitoso, lo logueamos automáticamente
        await login(formData.username, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.username?.[0] || "Error en el proceso. Revisa los datos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">🐊</span>
          <h2>Portal de la Facultad de Tecnologías Interactivas</h2>
          <p>{isLogin ? "Accede a tu cuenta" : "Regístrate como Editor"}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-grupo">
            <label>Usuario</label>
            <input type="text" name="username" onChange={handleChange} required />
          </div>

          {!isLogin && (
            <>
              <div className="form-grupo">
                <label>Correo Electrónico</label>
                <input type="email" name="email" onChange={handleChange} required />
              </div>
              <div className="form-grupo">
                <label>Carnet de Identidad (CI)</label>
                <input type="text" name="ci" onChange={handleChange} required />
              </div>
            </>
          )}

          <div className="form-grupo">
            <label>Contraseña</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? "Procesando..." : (isLogin ? "Iniciar Sesión" : "Registrarse")}
          </button>
        </form>

        <div className="login-footer">
          <button className="btn-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}