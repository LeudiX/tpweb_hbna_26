import axios from 'axios';

// Creamos una instancia personalizada de Axios para tener la url base de la api y otras confs
const apiClient = axios.create({
  // Aquí ponemos la URL base de la api para no repetir la url. 
  baseURL: 'http://localhost:8000/api', 
  timeout: 10000, // Si el servidor tarda más de 10 segundos, cancela la petición
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE PETICIONES: Inyecta el token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;