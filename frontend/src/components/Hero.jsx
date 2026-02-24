import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatPrice } from '../utils/currency';

const Hero = () => {
    const [heroData, setHeroData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/hero')
            .then(res => setHeroData(res.data))
            .catch(err => console.error("Failed to fetch hero data:", err));
    }, []);

    if (!heroData) return null; // Wait for data to load

    return (
        <section className="container">
            <div className="hero-section new-hero-layout">
                <div className="new-hero-container">

                    {/* Text Content Side */}
                    <div className="new-hero-content">
                        <div className="hero-badge" style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-dark)' }}>
                            <span className="badge-dot"></span>
                            Featured Product
                        </div>
                        <h1 className="hero-title">
                            {heroData.title_black} <br /><span className="text-highlight" style={{ color: 'var(--primary-teal)' }}>{heroData.title_colored} </span>{heroData.title_black_2}
                        </h1>

                        <div className="new-hero-rating">
                            <div className="stars" style={{ display: 'flex', gap: '4px' }}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />)}
                            </div>
                            <span>{heroData.rating} ({heroData.reviews_count} Reviews)</span>
                        </div>

                        <p className="hero-subtitle">
                            {heroData.subtitle}
                        </p>

                        <div className="hero-actions new-hero-actions">
                            <Link to="/shop" className="btn-primary hero-btn">
                                <ShoppingBag size={20} /> Shop Now
                            </Link>
                            <div className="new-hero-price">
                                <span className="current-price">{formatPrice(parseFloat(heroData.current_price))}</span>
                                <span className="old-price">{formatPrice(parseFloat(heroData.old_price))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="new-hero-image-side">
                        <div className="new-hero-glow"></div>
                        <img
                            className="floating-image"
                            src={heroData.image_url}
                            alt="Featured Product"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
