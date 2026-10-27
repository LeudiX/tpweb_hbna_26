import "./social-icons.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SocialIcon({ nombre, url, icono }) {
  if (!icono) return null;

  return (
    <a 
      href={url} 
      className="social-icon" 
      title={nombre} 
      aria-label={nombre}
      target="_blank" 
      rel="noopener noreferrer"
    >
      {/* Aquí renderizamos el icono que nos pasen por props */}
      <FontAwesomeIcon icon={icono} className="social-icon-svg" />
    </a>
  );
}