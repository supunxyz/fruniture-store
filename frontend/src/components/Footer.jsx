import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-sec">
            <div className="container footer-grid">

                {/* Brand Section */}
                <div className="footer-brand">
                    <h2 className="footer-logo"><span>F</span>Furnish.</h2>
                    <p className="footer-desc">
                        Transforming houses into homes with carefully curated, high-quality furniture pieces designed for modern living.
                    </p>
                    <div className="footer-socials">
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                    </div>
                </div>

                {/* Important Links */}
                <div className="footer-links-col">
                    <h3 className="footer-heading">Important Links</h3>
                    <ul className="footer-links">
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-contact-col">
                    <h3 className="footer-heading">Contact Info</h3>
                    <div className="footer-contact-list">
                        <div className="footer-contact-item">
                            <MapPin size={20} className="footer-icon" />
                            <span>123 Furniture Avenue, Design District, NY 10001</span>
                        </div>
                        <div className="footer-contact-item">
                            <Phone size={20} className="footer-icon" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="footer-contact-item">
                            <Mail size={20} className="footer-icon" />
                            <span>hello@furnish.store</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="footer-copyright">
                <p>&copy; {new Date().getFullYear()} Furnish. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
