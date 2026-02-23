import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="container">
            <div className="hero-section">
                <div className="hero-shape">
                    <div className="hero-content-wrapper">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            2026 Collection
                        </div>
                        <h1 className="hero-title">
                            Discover Your<br /> Perfect <span className="text-highlight">Space</span>
                        </h1>
                        <p className="hero-subtitle">
                            Transform your home with our premium furniture collection. Minimalist designs crafted for unmatched comfort and modern aesthetics.
                        </p>
                        <div className="hero-actions">
                            <Link to="/shop" className="btn-primary hero-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                Shop Collection <ArrowRight size={18} />
                            </Link>
                            <div className="hero-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />)}
                                </div>
                                <span>Trusted by 10k+ Customers</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
