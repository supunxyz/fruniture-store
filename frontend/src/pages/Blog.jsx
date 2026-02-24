import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "10 Minimalist Interior Design Tips",
            excerpt: "Discover how to embrace minimalism in your home without making it feel cold or empty. Learn to balance space, light, and objects.",
            image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=600&q=80",
            category: "Design Tips",
            date: "Feb 20, 2026"
        },
        {
            id: 2,
            title: "How to Choose the Perfect Living Room Sofa",
            excerpt: "Your sofa is the centerpiece of your living room. Read our comprehensive guide on fabrics, sizes, and styles before making a purchase.",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
            category: "Buying Guide",
            date: "Feb 15, 2026"
        },
        {
            id: 3,
            title: "The Return of Natural Wood Textures",
            excerpt: "Why natural and distressed wood finishes are making a massive comeback this year in modern interior design.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80",
            category: "Trends",
            date: "Feb 08, 2026"
        }
    ];

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '0' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Journal</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Inspiration, ideas, and latest trends for your home.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                    {posts.map(post => (
                        <div key={post.id} style={{ background: 'var(--card-bg)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <img src={post.image} alt={post.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.9rem' }}>
                                    <span style={{ background: 'var(--primary-teal-light)', color: 'white', padding: '4px 12px', borderRadius: '50px', fontWeight: '500' }}>{post.category}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{post.date}</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>{post.excerpt}</p>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                                    Read Article <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Blog;
