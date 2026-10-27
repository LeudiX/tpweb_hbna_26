import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/Footer/Footer"; 
import Home from "./pages/home/Home";
import NotFound from "./pages/error404/NotFound";

function App() {
  return (
    <BrowserRouter>
      {/* El Navbar está aquí afuera de Routes para que se muestre en TODAS las páginas */}
      <Navbar />
      
      {/* Aquí es donde ocurre la magia: se intercambian los componentes según la URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* El asterisco (*) significa "cualquier otra ruta no definida arriba" */}
        <Route path="*" element={<NotFound />} />
      </Routes>

       <Footer />
    </BrowserRouter>
  );
}

export default App;