import { useState } from "react";
import "./home.css";
import NoticiaCard from "../../components/Noticia/NoticiaCard";
import ScrollApple from "../../components/ScrollApple/ScrollApple";
// import StatsBanner from "../../components/Stadistic/Stats";
import Extension from "../../components/Extensión/Extension";

const noticiasEjemplo = [
  {
    id: "investigacion",
    titulo: "Ideas para un futuro conectado",
    contenido: "Proyectos académicos que acercan la tecnología a la sociedad, demostrando el impacto de nuestra facultad en el entorno actual y futuro.",
    imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    fecha: "2026-10-25",
    destacada: true,
    enlace: "/noticias/1",
  },
  {
    id: "estudiantes",
    titulo: "Aprender creando en equipo",
    contenido: "El talento y la colaboración impulsan nuevas ideas entre nuestros estudiantes de tercer año, quienes desarrollan proyectos innovadores.",
    imagen: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    fecha: "2026-10-20",
    destacada: false,
    enlace: "/noticias/2",
  },
  {
    id: "eventos",
    titulo: "Encuentros para compartir conocimiento",
    contenido: "Conferencias y actividades para toda la comunidad universitaria este próximo mes. No te pierdas las ponencias de nuestros expertos.",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85",
    fecha: "2026-10-15",
    destacada: false,
    enlace: "/noticias/3",
  },
  {
    id: "eventos",
    titulo: "Encuentros para compartir conocimiento",
    contenido: "Conferencias y actividades para toda la comunidad universitaria este próximo mes. No te pierdas las ponencias de nuestros expertos.",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85",
    fecha: "2026-10-15",
    destacada: false,
    enlace: "/noticias/3",
  },
  {
    id: "eventos",
    titulo: "Encuentros para compartir conocimiento",
    contenido: "Conferencias y actividades para toda la comunidad universitaria este próximo mes. No te pierdas las ponencias de nuestros expertos.",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85",
    fecha: "2026-10-15",
    destacada: false,
    enlace: "/noticias/3",
  },
  {
    id: "eventos",
    titulo: "Encuentros para compartir conocimiento",
    contenido: "Conferencias y actividades para toda la comunidad universitaria este próximo mes. No te pierdas las ponencias de nuestros expertos.",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=85",
    fecha: "2026-10-15",
    destacada: false,
    enlace: "/noticias/3",
  },
];

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
  textoBadge: "🏆 Campeones Juegos Deportivos Mella 2023-2024",
  titulo: "Caimanes: Pasión por la Competencia y la Hermandad",
  descripcion: "Desde las noches sin dormir en las Game Jams diseñando mundos en 3D hasta las gradas repletas con camisetas verdes en los campeonatos de la UCI, la FTI se define por su energía creadora, su identidad colectiva y su orgullo deportivo.",
  infoEsports: "🎮 Gaming Arena: La facultad cuenta con escuadras oficiales de Dota 2, Valorant, CS2 y fighting games que compiten en ligas universitarias nacionales con transmisión en vivo."
};

// 2. El ícono de la flecha
function IconoFlecha() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
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
                {/* Renderizamos directamente los datos de ejemplo */}
                {noticiasEjemplo.map((noticia) => (
                  <NoticiaCard 
                    key={noticia.id} 
                    noticia={noticia} 
                    destacada={noticia.destacada} 
                  />
                ))}
              </div>
            </div>
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