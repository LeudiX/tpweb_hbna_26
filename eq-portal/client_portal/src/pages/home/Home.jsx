import { useState, useEffect } from "react";
import "./home.css";
import NoticiaCard from "../../components/Noticia/NoticiaCard";
import ScrollApple from "../../components/ScrollApple/ScrollApple";
// import StatsBanner from "../../components/Stadistic/Stats";
import Extension from "../../components/Extensión/Extension";
import { obtenerNoticias } from "../../services/noticiaService";

const estadisticas = [
  { numero: "+2,400", texto: "Ingenieros y Especialistas Graduados" },
  { numero: "14", texto: "Laboratorios y Cátedras de I+D" },
  { numero: "JAN", texto: "Acreditación de Excelencia Académica" },
  { numero: "38+", texto: "Premios Nacionales en Software e Innovación" },
];

// Datos para la tarjeta principal de los Mellas
const datosCaimanesPremio = {
  imagen: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
  altImagen: "Afición Caimán en el estadio",
  textoBadge: "Campeones Juegos Deportivos Mella 2023-2024",
  titulo: "Caimanes: Pasión por la Competencia y la Hermandad",
  descripcion: "Desde las noches sin dormir en las Game Jams diseñando mundos en 3D hasta las gradas repletas con camisetas verdes en los campeonatos de la UCI, la FTI se define por su energía creadora, su identidad colectiva y su orgullo deportivo.",
  infoEsports: "Gaming Arena: La facultad cuenta con escuadras oficiales de Dota 2, Valorant, CS2 y fighting games que compiten en ligas universitarias nacionales con transmisión en vivo."
};

// El ícono de la flecha
function IconoFlecha() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {

  /* UseEffect para manejar los datos de las noticias y para la paginación*/
  const [paginaActual, setPaginaActual] = useState(1);
  const [haySiguiente, setHaySiguiente] = useState(false);
  const [hayAnterior, setHayAnterior] = useState(false);

  /* Se pone el array vacío porque si no da un error de array not defined*/
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  /* UseEffect para mostrar las noticias */
  useEffect(() => {
    // Creamos una función asíncrona interna
    const cargarDatos = async () => {
      try {
        setCargando(true);
        // Usamos await para esperar a que el servicio termine y poder obtener los datos si no da promise y nada más
        // Y guardamos los datos en la variable datos, además guardamos las noticias y los datos de paginación en sus respectivos estados
        const datos = await obtenerNoticias(paginaActual);
        setNoticias(datos.noticias);
        setHaySiguiente(datos.haySiguiente);
        setHayAnterior(datos.hayAnterior);
      } catch (err) {
        setError("No se pudieron cargar las noticias, intenta de nuevo más tarde.");
      } finally {
        // El bloque finally se ejecuta siempre (haya éxito o error)
        setCargando(false);
      }
    };

    // Ejecutamos la función que carga los datos para mostrarlos
    cargarDatos();

    // Limpiamos el error al cambiar de página para que no se quede el mensaje de error en la pantalla, es decir, que no se ejecuta
  }, [paginaActual]);

  // Función para renderizar las noticias según el estado de carga, error o si no hay noticias, si hay noticias, las mapea y las renderiza con el componente NoticiaCard
  const renderizarNoticias = () => {
    if (cargando) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;
    if (noticias.length === 0) return <p>No hay noticias todavía, espere a que se publiquen.</p>;

    return noticias.map((noticia) => (
      <ScrollApple key={noticia.id}>
        <NoticiaCard noticia={noticia} />
      </ScrollApple>
    ));
  };
    return (
    
        <div className="home">
          {/* SECCIÓN HERO */}
          <section className="hero">
            <div className="hero-fondo-oscuro"></div>
            <div className="hero-contenido">
              <p className="hero-subtitulo">Universidad de las Ciencias Informáticas</p>
              <h1 className="hero-titulo">
                Facultad de <br /> Tecnologías Interactivas
              </h1>
              <p className="hero-descripcion">
                Formamos profesionales que imaginan, diseñan y construyen nuevas experiencias digitales.
              </p>
              <button className="hero-boton">Conoce la facultad</button>
            </div>
            {/* <StatsBanner estadisticas={estadisticas} /> */}
          </section>

        {/* Scroll Apple para aplicar el componente de la transición parecida a Apple */}
        <ScrollApple>
          {/* SECCIÓN NOTICIA */}
          <section className="seccion-noticias" id="noticias">
            <div className="noticias-contenedor">
              <ScrollApple> 
                <div className="noticias-encabezado">
                  <div>
                    <p className="etiqueta-seccion">02 — Actualidad</p>
                    <h2 className="noticias-titulo">Últimas Noticias</h2>
                  </div>
                </div>
               </ScrollApple>

              <div className="noticias-cuadricula">
                {renderizarNoticias()}
              </div>
            </div>

            {/* CONTROLES DE PAGINACIÓN que ofrece Django Rest pro defecto*/}
            {!cargando && !error && (
              <div className="paginacion-controles">
                <button 
                  className="btn-pagina"
                  disabled={!hayAnterior} 
                  onClick={() => setPaginaActual(paginaActual - 1)}
                >
                  ← Anterior
                </button>

                <span className="pagina-texto">Página {paginaActual}</span>

                <button 
                  className="btn-pagina"
                  disabled={!haySiguiente} 
                  onClick={() => setPaginaActual(paginaActual + 1)}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </section>
        </ScrollApple>    

        {/* SECCIÓN VIDA ESTUDIANTIL Y EXTENSIÓN */}
        <section id="extension">
          <Extension />    
        </section>

        {/* SECCIÓN La Investigación */}
          <section className="seccion-intro" id="investigacion">
            <div className="intro-contenedor">
              
              <ScrollApple direction="left">
                <div className="intro-texto-principal">
                  <p className="etiqueta-seccion">03 — Investigación</p>
                  <h2 className="intro-titulo">
                    La tecnología también <em>se imagina.</em>
                  </h2>
                </div>
              </ScrollApple>

              <ScrollApple direction="right" delay={200}>
              <div className="intro-texto-secundario">
                <p className="intro-descripcion">
                  Un espacio para aprender, investigar y desarrollar soluciones digitales con impacto. Conoce los centros de desarrollo y proyectos que forman a nuestra facultad.
                </p>
                <a className="enlace-verde" href="#extension">
                  Conoce nuestras centros de desarrollo <IconoFlecha />
                </a>
              </div>
            </ScrollApple>
            </div>
          </section>
   
         {/* --- SECCIÓN Consejo dedirección --- */}
          <ScrollApple>
            <section className="seccion-historia" id="consejo-direccion">
              <div className="historia-contenedor">

                {/* Columna Izquierda */}
                <div className="historia-texto">
                  <p className="etiqueta-seccion-clara">04 — Consejo de Dirección</p>
                  <h2 className="historia-titulo">Una facultad no se construye sola.</h2>
                  <p className="historia-descripcion">
                    Estudiantes y docentes colaboran para convertir preguntas en proyectos, conocimiento y oportunidades.
                  </p>
                  <a className="enlace-claro" href="#acerca">
                    Ver los ejecutivos de la FTI <IconoFlecha />
                  </a>
                </div>

                {/* Columna Derecha */}
                <div className="historia-imagen-contenedor">
                  <figure className="historia-figura">
                    <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85" 
                      alt="Personas colaborando alrededor de una mesa" 
                      loading="lazy" 
                      className="historia-imagen"
                    />
                  </figure>
                </div>
             </div>
            </section>
          </ScrollApple>
        </div>
     );
}