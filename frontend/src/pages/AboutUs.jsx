import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '0' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '120px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '16px' }}>About Furnish</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        We believe that your home should tell the story of who you are, and be a collection of what you love.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"
                        alt="Our Workshop"
                        style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    />
                    <div>
                        <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '24px' }}>Our Story</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '16px' }}>
                            Founded in 2020, Furnish started with a simple idea: to make high-quality, beautifully designed furniture accessible to everyone. We work directly with world-class manufacturers to cut out the middlemen and pass the savings on to you.
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            Every piece in our collection is thoughtfully designed to blend form and function perfectly. We source only the best materials, ensuring that our products don't just look great, but last for years to come.
                        </p>
                    </div>
                </div>

                <div style={{ background: 'var(--primary-teal)', borderRadius: '24px', padding: '60px 40px', textAlign: 'center', color: 'white' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Ready to transform your space?</h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                        Explore our latest collections and find the perfect pieces for your home.
                    </p>
                    <Link to="/shop" style={{ display: 'inline-block', background: 'white', color: 'var(--primary-teal)', padding: '14px 32px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>
                        Shop Collection
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
