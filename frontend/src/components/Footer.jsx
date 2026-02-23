import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: '#111827', color: '#9CA3AF', paddingTop: '60px', paddingBottom: '30px', marginTop: '60px' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginBottom: '40px' }}>

                {/* Brand Section */}
                <div>
                    <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '16px', fontWeight: 'bold' }}><span>F</span>Furnish.</h2>
                    <p style={{ lineHeight: '1.6', marginBottom: '24px', maxWidth: '300px' }}>
                        Transforming houses into homes with carefully curated, high-quality furniture pieces designed for modern living.
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="#" style={{ color: '#9CA3AF', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}><Instagram size={20} /></a>
                        <a href="#" style={{ color: '#9CA3AF', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}><Facebook size={20} /></a>
                        <a href="#" style={{ color: '#9CA3AF', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}><Twitter size={20} /></a>
                    </div>
                </div>

                {/* Important Links */}
                <div>
                    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Important Links</h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>Terms & Conditions</a></li>
                        <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Contact Info</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                            <MapPin size={20} style={{ color: 'var(--primary-teal)', flexShrink: 0, marginTop: '2px' }} />
                            <span>123 Furniture Avenue, Design District, NY 10001</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Phone size={20} style={{ color: 'var(--primary-teal)', flexShrink: 0 }} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Mail size={20} style={{ color: 'var(--primary-teal)', flexShrink: 0 }} />
                            <span>hello@furnish.store</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div style={{ borderTop: '1px solid #374151', paddingTop: '30px', textAlign: 'center' }}>
                <p>&copy; {new Date().getFullYear()} Furnish. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
