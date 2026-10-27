import { useEffect, useRef, useState } from "react";
import "./scroll-apple.css";

export default function ScrollReveal({ children, delay = 0, direction = "up" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // IntersectionObserver vigila si el elemento entra en pantalla
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez que aparece, dejamos de vigilarlo para que no parpadee
          observer.unobserve(entry.target); 
        }
      },
      {
        threshold: 0.1, // Se activa cuando al menos el 10% del elemento es visible
        rootMargin: "0px 0px -50px 0px" // Se activa un poquito antes de llegar al borde
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Determinamos la clase de la animación
  let animationClass = "reveal-up";
  if (direction === "left") animationClass = "reveal-left";
  if (direction === "right") animationClass = "reveal-right";
  if (direction === "fade") animationClass = "reveal-fade";

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${animationClass} ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }} // Permite hacer efecto cascada
    >
      {children}
    </div>
  );
}