import { useState, useEffect } from "react";
import { obtenerDepartamentos } from "../../services/institucionalService";
import InstitutionalHero from "../../components/institucional/InstitutionalHero";
import InstitutionalIntro from "../../components/institucional/InstitucionalIntro";
import "../../components/institucional/institucional.css";

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerDepartamentos();
        setDepartamentos(res);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <InstitutionalHero 
        eyebrow="ESTRUCTURA ACADÉMICA · FTI"
        title="Departamentos Docentes"
        subtitle="Los pilares sobre los que se sustenta la formación, la investigación y la extensión en nuestra facultad."
      />
      
      <InstitutionalIntro 
        eyebrow="CONOCE NUESTRA ESTRUCTURA"
        title="Un departamento para cada área del saber."
        description="Cada departamento agrupa a los docentes e investigadores de una rama específica de la tecnología, garantizando una formación especializada y el desarrollo de proyectos con impacto institucional."
      />

      <section className="inst-container" style={{ paddingBottom: '5rem' }}>
        {cargando ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando departamentos...</p>
        ) : departamentos.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No hay departamentos registrados.</p>
        ) : (
          <div className="inst-grid-3">
            {departamentos.map((depto) => (
              <div key={depto.id} className="inst-role-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.5rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
                  {depto.nombre}
                </h3>
                <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                  Jefe: {depto.jefe}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {depto.descripcion || "Este departamento no tiene una descripción registrada aún."}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}