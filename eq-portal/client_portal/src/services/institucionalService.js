import apiClient from './apiClient';

const API_BASE_URL = "http://localhost:8000";

// Función auxiliar para las fotos del consejo
const adaptarFoto = (miembro) => {
  let urlFoto = "https://via.placeholder.com/150?text=Sin+Foto";
  if (miembro.foto) {
    urlFoto = miembro.foto.startsWith("http") ? miembro.foto : `${API_BASE_URL}${miembro.foto}`;
  }
  return { ...miembro, foto: urlFoto };
};

// Centros
export const obtenerCentros = async () => {
  const res = await apiClient.get('/institucional/centros/');
  return res.data.results ? res.data.results : res.data;
};

export const crearCentro = async (datos) => {
  const res = await apiClient.post('/institucional/centros/', datos);
  return res.data;
};
export const actualizarCentro = async (id, datos) => {
  const res = await apiClient.put(`/institucional/centros/${id}/`, datos);
  return res.data;
};
export const eliminarCentro = async (id) => {
  await apiClient.delete(`/institucional/centros/${id}/`);
};

// Feu
export const obtenerFeu = async () => {
  const res = await apiClient.get('/institucional/feu/');
  return res.data.results ? res.data.results : res.data;
};

export const crearFeu = async (datos) => {
  const res = await apiClient.post('/institucional/feu/', datos);
  return res.data;
};
export const actualizarFeu = async (id, datos) => {
  const res = await apiClient.put(`/institucional/feu/${id}/`, datos);
  return res.data;
};
export const eliminarFeu = async (id) => {
  await apiClient.delete(`/institucional/feu/${id}/`);
};

// Departamentos
export const crearDepartamento = async (datos) => {
  const res = await apiClient.post('/institucional/departamentos/', datos);
  return res.data;
};

export const obtenerDepartamentos = async () => {
  const res = await apiClient.get('/institucional/departamentos/');
  return res.data.results ? res.data.results : res.data;
};

export const actualizarDepartamento = async (id, datos) => {
  const res = await apiClient.put(`/institucional/departamentos/${id}/`, datos);
  return res.data;
};

export const eliminarDepartamento = async (id) => {
  await apiClient.delete(`/institucional/departamentos/${id}/`);
};

// Consejo
export const crearConsejo = async (datos, imagenFile) => {
  const formData = new FormData();
  formData.append('nombre', datos.nombre);
  formData.append('correo', datos.correo);
  formData.append('cargo', datos.cargo);
  if (imagenFile) formData.append('foto', imagenFile);
  
  const res = await apiClient.post('/institucional/consejo/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const actualizarConsejo = async (id, datos, imagenFile) => {
  const formData = new FormData();
  formData.append('nombre', datos.nombre);
  formData.append('correo', datos.correo);
  formData.append('cargo', datos.cargo);
  if (imagenFile) formData.append('foto', imagenFile);
  
  const res = await apiClient.put(`/institucional/consejo/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const eliminarConsejo = async (id) => {
  await apiClient.delete(`/institucional/consejo/${id}/`);
};

export const obtenerConsejo = async () => {
  const res = await apiClient.get('/institucional/consejo/');
  const lista = res.data.results ? res.data.results : res.data;
  return lista.map(adaptarFoto);
};