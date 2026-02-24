import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PromoBanner from '../components/PromoBanner';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/products/')
            .then(res => {
                setProducts(res.data);
                const cats = ['All', ...new Set(res.data.map(p => p.category))];
                setCategories(cats);
            })
            .catch(err => console.error('Failed to fetch products', err));
    }, []);

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Navbar />
            <PromoBanner />

            <div className="container" style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>All Products</h1>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Filter size={20} color="var(--text-muted)" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                <div className="product-image-container">
                                    <img
                                        src={product.image_url && product.image_url !== 'pending' ? product.image_url : 'https://placehold.co/400x400/f5f5f5/aaa?text=No+Image'}
                                        alt={product.name}
                                        onError={e => { e.target.src = 'https://placehold.co/400x400/f5f5f5/aaa?text=No+Image'; }}
                                    />
                                </div>
                            </Link>

                            <div className="product-info">
                                <div>
                                    <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "8px 0 4px" }}>{product.category}</p>
                                    <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        <h3 className="product-name">{product.name}</h3>
                                    </Link>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                        <Star size={16} fill="#D4AF37" color="#D4AF37" />
                                        <span style={{ fontSize: "14px", fontWeight: "600" }}>{product.rating}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="product-price">${product.price.toFixed(2)}</span>
                                        {product.original_price && (
                                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '14px' }}>
                                                ${product.original_price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {product.description && (
                                        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                                <button className="btn-cart" onClick={() => addToCart(product)} title="Add to Cart">
                                    <ShoppingCart size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
