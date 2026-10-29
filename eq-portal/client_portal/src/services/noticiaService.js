import apiClient from './apiClient';

// Rutas de las imágenes
const API_BASE_URL = "http://localhost:8000";

// Función auxiliar para no repetir la lógica de las imágenes
const adaptarNoticia = (noticia) => {
  let urlImagen = "https://via.placeholder.com/400x200?text=Sin+Imagen";
  
  if (noticia.imagen) {
    urlImagen = noticia.imagen.startsWith("http") 
      ? noticia.imagen 
      : `${API_BASE_URL}${noticia.imagen}`;
  }

  return {
    ...noticia,
    imagen: urlImagen,
    enlace: `/noticias/${noticia.id}`,
  };
};

// Función para obtener las noticias solamente
export const obtenerNoticias = async (page = 1) => {
  try {
    // Hacemos la petición agregando solo parte de la url de la api que no se repite
    const respuesta = await apiClient.get(`/noticias/noticias/?page=${page}`);
    
    // Guardamos los datos que viene en el array data que además viene ya en formato JSON
    const datos = respuesta.data;

    const listaNoticias = datos.results ? datos.results : datos;
    
    // Adaptamos las noticias usando la función auxiliar
    const noticiasFormateadas = listaNoticias.map(adaptarNoticia);

    return {
      noticias: noticiasFormateadas,

      // Esto es para saber si en el paginador hay noticias siguientes y anteriores
      haySiguiente: datos.next !== null && datos.next !== undefined,
      hayAnterior: datos.previous !== null && datos.previous !== undefined,
    };
    
  } catch (error) {
    // Lanza un error automáticamente si el servidor responde con 404, 500, etc.
    console.error("Error en noticiaService:", error);
    throw new Error("Error al conectar con el servidor de noticias");
  }
};

// Función para obtener noticias por ID
export const obtenerNoticiaPorId = async (id) => {
  try {
    const respuesta = await apiClient.get(`/noticias/noticias/${id}/`);
    const noticia = respuesta.data;

    return adaptarNoticia(noticia);
  } catch (error) {
    console.error("Error en obtenerNoticiaPorId:", error);
    throw error;
  }
};