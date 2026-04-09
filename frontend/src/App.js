import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import HomePage     from './pages/HomePage';
import VendorsPage  from './pages/VendorsPage';
import VendorDetail from './pages/VendorDetail';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage  from './pages/ProfilePage';
import AdminPage    from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import './App.css';

const Private = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};
const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <Routes>
        <Route path="/"                element={<HomePage />} />
        <Route path="/category/:slug"  element={<CategoryPage />} />
        <Route path="/vendors"         element={<VendorsPage />} />
        <Route path="/vendors/:id"     element={<VendorDetail />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/bookings"        element={<Private><BookingsPage /></Private>} />
        <Route path="/profile"         element={<Private><ProfilePage /></Private>} />
        <Route path="/admin"           element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
