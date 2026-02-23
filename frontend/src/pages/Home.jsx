import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Products from '../components/Products';

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Products />
            <footer className="footer">
                <div className="container">
                    <h2>Furnish.</h2>
                    <p>&copy; 2026 Furnish. Store. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default Home;
