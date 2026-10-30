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

// 1. Creamos un sub-componente para poder usar useLocation dentro del Router
function AppContent() {
  const location = useLocation();

  // 2. Definimos las rutas donde NO queremos que salga el Navbar ni el Footer
  // Usamos startsWith para que también oculte el navbar en /dashboard/loquesea
  const ocultarLayout = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <>
      {/* Solo mostramos el Navbar si NO estamos en el dashboard ni en el login */}
      {!ocultarLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/noticias/crear" element={<RutaProtegida><NoticiaForm /></RutaProtegida>} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Solo mostramos el Footer si NO estamos en el dashboard ni en el login */}
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