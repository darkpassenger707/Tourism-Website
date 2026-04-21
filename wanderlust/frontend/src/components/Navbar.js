import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);
  const { user, logout }        = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/packages', label: 'Packages' },
    { to: '/transport', label: 'Transport' },
    { to: '/ai-recommender', label: 'AI Guide' },
    { to: '/visa', label: 'Visa' },
    { to: '/booking', label: 'Book Now' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <svg className="navbar-logo-icon" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="17" stroke="#c8a96e" strokeWidth="1.5"/>
          <path d="M18 8 L22 16 L30 17 L24 23 L26 31 L18 27 L10 31 L12 23 L6 17 L14 16 Z" fill="none" stroke="#c8a96e" strokeWidth="1.2"/>
        </svg>
        Wander<span>lust</span>
      </Link>

      {/* Desktop Links */}
      <div className="navbar-links">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {user ? (
          <>
            <NavLink to="/account" className={({ isActive }) => `btn-nav ${isActive ? 'active' : ''}`}
              style={{ background: 'transparent', border: '1.5px solid rgba(200,169,110,0.6)', color: scrolled ? '#1a3a2a' : '#c8a96e' }}>
              👤 {user.full_name?.split(' ')[0]}
            </NavLink>
            <button className="btn-nav" onClick={handleLogout}
              style={{ background: 'transparent', border: '1.5px solid rgba(200,169,110,0.6)', color: scrolled ? '#7a7060' : 'rgba(255,255,255,0.7)', padding:'10px 16px' }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/account" className="btn-nav"
              style={{ background: 'transparent', border: '1.5px solid rgba(200,169,110,0.5)', color: scrolled ? '#1a3a2a' : 'rgba(255,255,255,0.8)' }}>
              Sign In
            </Link>
            <Link to="/account?tab=register" className="btn-nav">Get Started</Link>
          </>
        )}
      </div>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span/><span/><span/>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position:'fixed', inset:0, background:'var(--forest)', zIndex:999,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32,
        }}>
          <button onClick={() => setMenuOpen(false)}
            style={{ position:'absolute', top:24, right:24, background:'none', color:'var(--white)', fontSize:'1.5rem' }}>✕</button>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              style={{ font:'600 1.6rem var(--font-display)', color:'var(--white)', letterSpacing:'0.02em' }}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}
              style={{ font:'500 0.9rem var(--font-body)', color:'var(--gold)', letterSpacing:'0.1em', textTransform:'uppercase', background:'none' }}>
              Sign Out
            </button>
          ) : (
            <Link to="/account" onClick={() => setMenuOpen(false)}
              style={{ font:'500 0.9rem var(--font-body)', color:'var(--gold)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
