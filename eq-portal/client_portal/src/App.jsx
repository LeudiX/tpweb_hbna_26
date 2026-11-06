import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/Footer/Footer"; 
import Home from "./pages/home/Home";
import NotFound from "./pages/error404/NotFound";
import NoticiaDetalle from "./pages/noticias/NoticiaDetalle";
import Dashboard from "./pages/dashboard/Dashboard";
import NoticiaForm from "./components/formularios/UsuarioForm"
import Login from "./pages/auth/Login"; 
import { useAuth } from "./context/AuthContext";

// Componente para proteger rutas
const RutaProtegida = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Creamos un sub-componente para poder usar useLocation dentro del Router
function AppContent() {
  const location = useLocation();

  // Definimos las rutas donde no queremos que se muestre el Navbar ni el Footer
  // Usamos startsWith para que también oculte el navbar en /dashboard/loquesea, es decir, la ruta que comienza por dashboard o login
  const ocultarLayout = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <>
      {/* Solo mostramos el Navbar si no estamos en el dashboard ni en el login */}
      {!ocultarLayout && <Navbar />}

      <Routes>

        {/* path dirección de la routa y element sería la page a mostrar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Ruta protegida para que solo los usuarios con permisos puedan entrar */}
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/noticias/crear" element={<RutaProtegida><NoticiaForm /></RutaProtegida>} />

        {/* Ruta para cuando den click en leer más sobre una noticia, tomamos el id de la url */}
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />

        {/* Pagina de error 404 cuando se ingresa una ruta que no ha sido registrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Solo mostramos el Footer si no estamos en el dashboard ni en el login */}
      {!ocultarLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;