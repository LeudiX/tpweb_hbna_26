import { Link } from "react-router-dom";

/* Iconos de FontAwesome pues se hace una importación que viene para react */
import { 
  faTelegram, 
  faFacebook, 
  faXTwitter, 
  faYoutube, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons';

import SocialIcon from "../Icons/SocialIcons";

export default function FooterBrand() {
  return (
    <div className="footer-col-identidad" >
      <Link to="/" className="footer-logo">
        <span className="footer-logo-emoji">🐊</span>
        <span className="footer-logo-texto">FTI Caimanes · UCI</span>
      </Link>
      <p className="footer-descripcion">
        Facultad de Tecnologías Interactivas. Formación de ingenieros de excelencia en el ámbito de las tecnologías interactivas, con un enfoque en la innovación y la creatividad.
      </p>
      
      {/* Instanciación directa pasando el objeto del icono de FontAwesome */}
      <div className="footer-redes-contenedor" style={{display: 'flex', gap: '10px'}}>
        <SocialIcon 
          nombre="Telegram" 
          url="https://t.me/fti_uci" 
          icono={faTelegram} 
        />
        <SocialIcon 
          nombre="Facebook" 
          url="https://facebook.com/fti.uci" 
          icono={faFacebook} 
        />
        <SocialIcon 
          nombre="X (Twitter)" 
          url="https://x.com/fti_uci" 
          icono={faXTwitter} 
        />
        <SocialIcon 
          nombre="YouTube" 
          url="https://youtube.com/@fti_uci" 
          icono={faYoutube} 
        />
        <SocialIcon 
          nombre="GitHub" 
          url="https://github.com/fti-uci" 
          icono={faGithub} 
        />
      </div>
    </div>
  );
}