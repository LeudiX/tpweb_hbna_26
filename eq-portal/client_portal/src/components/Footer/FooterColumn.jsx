export default function FooterColumn({ titulo, items }) {
  return (
    <div className="footer-columna">
      <h3 className="footer-titulo-columna">{titulo}</h3>
      <ul className="footer-lista">
        {items.map((item, index) => (
          <li key={index}>
            {item.url ? (
              <a href={item.url} className="footer-enlace">
                {item.texto}
              </a>
            ) : (
              <span className="footer-texto">{item.texto}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}