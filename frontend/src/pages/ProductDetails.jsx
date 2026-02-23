import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { Star, ArrowLeft, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setActiveImage(res.data.image_url);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch product details', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ padding: '120px 20px', textAlign: 'center', fontSize: '1.2rem' }}>Loading product details...</div>;

    if (!product) return <div style={{ padding: '120px 20px', textAlign: 'center', fontSize: '1.2rem' }}>Product not found. <Link to="/shop" style={{ color: 'var(--primary-teal)', textDecoration: 'underline' }}>Back to Shop</Link></div>;

    return (
        <div style={{ paddingBottom: '80px' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '120px' }}>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                    <ArrowLeft size={20} /> Back to Shop
                </Link>

                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

                    {/* Product Image Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={activeImage} alt={product.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '16px', transition: 'all 0.3s ease' }} />
                        </div>

                        {product.images && product.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                {/* Main Image Thumbnail */}
                                <div
                                    onClick={() => setActiveImage(product.image_url)}
                                    style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--bg-secondary)', cursor: 'pointer', border: activeImage === product.image_url ? '2px solid var(--primary-teal)' : '2px solid transparent', overflow: 'hidden', flexShrink: 0 }}
                                >
                                    <img src={product.image_url} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                {/* Additional Images */}
                                {product.images.map((img) => (
                                    <div
                                        key={img.id}
                                        onClick={() => setActiveImage(img.image_url)}
                                        style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--bg-secondary)', cursor: 'pointer', border: activeImage === img.image_url ? '2px solid var(--primary-teal)' : '2px solid transparent', overflow: 'hidden', flexShrink: 0 }}
                                    >
                                        <img src={img.image_url} alt={`Gallery ${img.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span className="tag" style={{ background: 'var(--primary-teal-light)', color: 'white' }}>{product.category}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={18} fill="#D4AF37" color="#D4AF37" />
                                <span style={{ fontWeight: '600' }}>{product.rating} Rating</span>
                            </div>
                        </div>

                        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>${product.price.toFixed(2)}</span>
                            {product.original_price && (
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
                                    ${product.original_price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '40px' }}>
                            {product.description || `Enhance your space with our premium ${product.name}. Designed with both comfort and aesthetics in mind, this piece perfectly embodies modern elegance. It's the perfect addition to elevate your interior design.`}
                        </p>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                            <button className="btn-primary" onClick={() => addToCart(product)} style={{ padding: '16px 32px', fontSize: '1.1rem', flex: 1, justifyContent: 'center' }}>
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                                <div style={{ background: 'var(--bg-light)', padding: '12px', borderRadius: '50%', color: 'var(--primary-teal)' }}>
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Free Shipping</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>On orders over $500</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                                <div style={{ background: 'var(--bg-light)', padding: '12px', borderRadius: '50%', color: 'var(--primary-teal)' }}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>2 Year Warranty</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Guaranteed quality</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
