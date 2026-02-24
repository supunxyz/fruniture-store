import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';

const CATEGORIES = ['All', 'Design Tips', 'Buying Guide', 'Trends', 'Lifestyle', 'News'];

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        axios.get('http://localhost:8000/api/blog/?published_only=true')
            .then(res => setPosts(res.data))
            .catch(() => {
                // Fallback to demo posts if API not available
                setPosts([
                    { id: 1, title: "10 Minimalist Interior Design Tips", excerpt: "Discover how to embrace minimalism in your home without making it feel cold or empty.", image_url: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=600&q=80", category: "Design Tips", created_at: "2026-02-20T00:00:00" },
                    { id: 2, title: "How to Choose the Perfect Living Room Sofa", excerpt: "Your sofa is the centerpiece of your living room. Read our comprehensive guide on fabrics, sizes, and styles.", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", category: "Buying Guide", created_at: "2026-02-15T00:00:00" },
                    { id: 3, title: "The Return of Natural Wood Textures", excerpt: "Why natural and distressed wood finishes are making a massive comeback this year.", image_url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80", category: "Trends", created_at: "2026-02-08T00:00:00" },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

    const formatDate = (dateStr) => {
        try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch { return ''; }
    };

    return (
        <div style={{ background: 'var(--bg-light)', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px', paddingBottom: '80px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Journal</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                        Inspiration, ideas, and latest trends for your home.
                    </p>
                </div>

                {/* Category filter */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '8px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: 500,
                                cursor: 'pointer', border: '1.5px solid',
                                borderColor: activeCategory === cat ? 'var(--primary-teal)' : 'var(--border-color)',
                                background: activeCategory === cat ? 'var(--primary-teal)' : 'transparent',
                                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                        <BookOpen size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>Loading posts…</p>
                    </div>
                )}

                {/* Posts grid */}
                {!loading && (
                    <>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                <p>No posts in this category yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                                {filtered.map(post => (
                                    <div
                                        key={post.id}
                                        style={{ background: 'var(--card-bg)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                    >
                                        <img
                                            src={post.image_url || 'https://placehold.co/600x400/f5f5f5/aaa?text=No+Image'}
                                            alt={post.title}
                                            style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                                            onError={e => { e.target.src = 'https://placehold.co/600x400/f5f5f5/aaa?text=No+Image'; }}
                                        />
                                        <div style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.9rem' }}>
                                                {post.category && (
                                                    <span style={{ background: 'var(--primary-teal-light)', color: 'white', padding: '4px 12px', borderRadius: '50px', fontWeight: '500' }}>
                                                        {post.category}
                                                    </span>
                                                )}
                                                <span style={{ color: 'var(--text-muted)' }}>{formatDate(post.created_at)}</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h3>
                                            {post.excerpt && (
                                                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>{post.excerpt}</p>
                                            )}
                                            <button style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0 }}>
                                                Read Article <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Blog;
