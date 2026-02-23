import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent layout jumps when navbar becomes fixed */}
      {scrolled && <div style={{ height: '80px' }}></div>}

      <nav className={`navbar container ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-logo">
          <h2><span>F</span>Furnish.</h2>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="active" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Product</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
        </div>

        <div className="nav-icons">
          <Search className="nav-icon" />
          <Heart className="nav-icon" />
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <ShoppingBag className="nav-icon" />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
          <Link to={user ? "/profile" : "/login"} style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {user && user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-teal)' }}
              />
            ) : (
              <User className="nav-icon" />
            )}
          </Link>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
