import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/blog', label: 'Blog' },
];

const Navbar = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const cartCount = cart.reduce((n, item) => n + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  /* ── Scroll glass effect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  /* ── Lock body scroll while menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Permanent spacer so content sits below fixed navbar */}
      <div style={{ height: '72px' }} aria-hidden="true" />

      <header className={`navbar-header${scrolled ? ' scrolled' : ''}`} ref={menuRef}>
        <div className="navbar-inner container">

          {/* ── Logo ── */}
          <Link to="/" className="navbar-logo" onClick={close}>
            <span className="navbar-logo-accent">F</span>urnish.
          </Link>

          {/* ── Desktop links (centre) ── */}
          <nav className="navbar-desktop-links" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="navbar-link">
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop icons (right) ── */}
          <div className="navbar-actions">
            <Link to="/cart" className="navbar-icon-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
            </Link>
            <Link
              to={user ? '/profile' : '/login'}
              className="navbar-icon-btn"
              aria-label="Account"
            >
              {user?.profile_picture
                ? <img src={user.profile_picture} alt="Profile" className="navbar-avatar" />
                : <User size={20} />}
            </Link>

            {/* ── Hamburger (mobile only) ── */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div className={`navbar-mobile-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <nav className="navbar-mobile-links" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="navbar-mobile-link" onClick={close}>
                {label}
              </NavLink>
            ))}

            <div className="navbar-mobile-divider" />

            {/* Mobile cart & account */}
            <Link to="/cart" className="navbar-mobile-link navbar-mobile-icon-row" onClick={close}>
              <ShoppingBag size={18} />
              Cart
              {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
            </Link>
            <Link
              to={user ? '/profile' : '/login'}
              className="navbar-mobile-link navbar-mobile-icon-row"
              onClick={close}
            >
              <User size={18} />
              {user ? 'My Profile' : 'Sign In'}
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Backdrop overlay for mobile ── */}
      {menuOpen && (
        <div className="navbar-overlay" onClick={close} aria-hidden="true" />
      )}
    </>
  );
};

export default Navbar;
