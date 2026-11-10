import { useState, useEffect } from "react";
import { obtenerCentros } from "../../services/institucionalService";
import InstitutionalHero from "../../components/institucional/InstitutionalHero";
import InstitutionalIntro from "../../components/institucional/InstitucionalIntro";
import "../../components/institucional/institucional.css";

export default function CentrosPage() {
  const [centros, setCentros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerCentros();
        setCentros(res);
      } catch (error) {
        console.error("Error al cargar centros:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <InstitutionalHero 
        eyebrow="INVESTIGACIÓN E INNOVACIÓN · FTI"
        title="Centros de Desarrollo"
        subtitle="Espacios donde la teoría se convierte en software, prototipos y soluciones reales para la sociedad."
      />
      
      <InstitutionalIntro 
        eyebrow="NUESTROS LABORATORIOS"
        title="Creando el futuro tecnológico."
        description="Nuestros centros de desarrollo agrupan a estudiantes y profesores en líneas de investigación específicas, generando productos de software de alto impacto y fomentando la innovación constante."
      />

      <section className="inst-container" style={{ paddingBottom: '5rem' }}>
        {cargando ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando centros...</p>
        ) : centros.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No hay centros registrados.</p>
        ) : (
          <div className="inst-grid-2">
            {centros.map((centro) => (
              <div key={centro.id} className="inst-role-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.6rem', color: 'var(--color-dark)' }}>
                    {centro.nombre}
                  </h3>
                  <span style={{ background: '#e6f4ea', color: 'var(--color-primary)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    I+D
                  </span>
                </div>
                
                <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Jefe del Centro: {centro.jefe}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.3rem' }}>Línea de Desarrollo</p>
                  <p style={{ color: '#475569', fontSize: '0.95rem' }}>{centro.linea_desarrollo}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.3rem' }}>Principales Productos</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{centro.principales_productos}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}