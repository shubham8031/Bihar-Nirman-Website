import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiShield } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="logo-icon">🏗️</span>
          <div>
            <span className="logo-main">Bihar Nirman Hub</span>
            <span className="logo-sub">बिहार निर्माण हब</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/"        className={isActive('/')}>Home</Link>
          <Link to="/vendors" className={isActive('/vendors')}>All Vendors</Link>
          <Link to="/category/bricks"  className="nav-cat">🧱 Bricks</Link>
          <Link to="/category/cement"  className="nav-cat">🏗️ Cement</Link>
          <Link to="/category/balu"    className="nav-cat">🪨 Balu</Link>
          <Link to="/category/wood"    className="nav-cat">🪵 Wood</Link>
          <Link to="/category/tiles"   className="nav-cat">🔲 Tiles</Link>
        </div>

        {/* Right Side */}
        <div className="nav-right">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">👋 {user.name.split(' ')[0]}</span>
              <div className="dropdown">
                <Link to="/bookings"><FiPackage /> My Bookings</Link>
                <Link to="/profile"><FiUser /> Profile</Link>
                {isAdmin && <Link to="/admin"><FiShield /> Admin Panel</Link>}
                <button onClick={handleLogout}><FiLogOut /> Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)}>
            {open ? <FiX size={22}/> : <FiMenu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          <Link to="/"        onClick={() => setOpen(false)}>🏠 Home</Link>
          <Link to="/vendors" onClick={() => setOpen(false)}>🏭 All Vendors</Link>
          <Link to="/category/bricks" onClick={() => setOpen(false)}>🧱 Bricks</Link>
          <Link to="/category/cement" onClick={() => setOpen(false)}>🏗️ Cement</Link>
          <Link to="/category/balu"   onClick={() => setOpen(false)}>🪨 Balu / Sand</Link>
          <Link to="/category/chhar"  onClick={() => setOpen(false)}>⛏️ Chhar / Gitti</Link>
          <Link to="/category/wood"   onClick={() => setOpen(false)}>🪵 Wood</Link>
          <Link to="/category/tiles"  onClick={() => setOpen(false)}>🔲 Tiles</Link>
          <Link to="/category/iron"   onClick={() => setOpen(false)}>⚙️ Iron & Steel</Link>
          <Link to="/category/paint"  onClick={() => setOpen(false)}>🎨 Paint</Link>
          {isLoggedIn ? (
            <>
              <Link to="/bookings" onClick={() => setOpen(false)}>📦 My Bookings</Link>
              <Link to="/profile"  onClick={() => setOpen(false)}>👤 Profile</Link>
              {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>🛡️ Admin</Link>}
              <button onClick={handleLogout} className="mob-logout">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setOpen(false)} className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
