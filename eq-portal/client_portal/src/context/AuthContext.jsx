import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Al cargar la app, verificamos si hay un token guardado
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

    const login = async (username, password) => {
    try {
      // 1. Pedimos el token
      const response = await apiClient.post('/token/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 2. Decodificamos el token para leer el rol que le pusimos en Django
      const payloadBase64 = access.split('.')[1];
      // Reemplazamos caracteres para que funcione en el navegador
      const payloadDecoded = JSON.parse(window.atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

      const userData = { 
        username: payloadDecoded.username, 
        rol: payloadDecoded.rol 
      };

      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};