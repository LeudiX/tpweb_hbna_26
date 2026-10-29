//  Guardamos la URL base en una constante para no repetirla, es decir solo tenemos la base
const API_BASE_URL = "http://localhost:8000";

export const obtenerNoticias = async (page = 1) => {
  try {
    // Hacemos la petición HTTP a Django que vienen en un objeto y las noticias están en results (esto es por la paginación de Django Rest Framework)
    const respuesta = await fetch(`${API_BASE_URL}/api/noticias/noticias/?page=${page}`);
    
    // Verificamos si la respuesta fue exitosa (código 200)
    if (!respuesta.ok) {
      throw new Error("Error al obtener las noticias del servidor, espere unos segundos y vuelva a intentarlo.");
    }

    // Convertimos la respuesta a JSON
    const datos = await respuesta.json();

    /* Verifica si los datos contienen la propiedad 'results', si la tiene un objeto con las noticias lo guarda, si viene en un arreglo igual los guardas */
    const listaNoticias = datos.results ? datos.results : datos;

    /* Formateamos las noticias para que tengan la URL completa de la imagen y un enlace dinámico */
    const noticiasFormateadas = listaNoticias.map((noticia) => {
      // Usamos un IF/ELSE normal para definir la URL de la imagen
      let urlImagen = null;

      if (noticia.imagen) {
        // Si la URL ya empieza con http, la dejamos igual. Si no, le pegamos la base. Esto es para que se deuvelven bien las imags
        if (noticia.imagen.startsWith("http")) {
          urlImagen = noticia.imagen;
        } else {
            // Si la URL no empieza con http, le pegamos la base. Esto es para que se devuelvan bien las imágenes
          urlImagen = `${API_BASE_URL}${noticia.imagen}`;
        }
      } else {
        // Si no hay imagen, usamos una de relleno (placeholder)
        urlImagen = "https://via.placeholder.com/400x200?text=Sin+Imagen";
      }

      // 7. Retornamos el objeto con los datos originales y los adaptados
      return {
        ...noticia, // Copia todas las propiedades originales (id, titulo, contenido)
        imagen: urlImagen, // Sobrescribe la imagen con la URL completa
        enlace: `/noticias/${noticia.id}`, // Crea el enlace dinámico usando el ID
      };
    });

    // Retornamos el objeto con las noticias y los datos de paginación
    return {
      noticias: noticiasFormateadas,
      haySiguiente: datos.next !== null && datos.next !== undefined,
      hayAnterior: datos.previous !== null && datos.previous !== undefined,
    };
    
  } catch (error) {
    // 8. Si algo falla (red, servidor apagado, etc.), lo capturamos
    console.error("Error en noticiaService:", error);
    throw error; // Lanzamos el error para que el componente Home lo maneje
  }
};