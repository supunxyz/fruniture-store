import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Products = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/products/best-selling')
            .then(res => setProducts(res.data))
            .catch(err => {
                console.error('Failed to fetch products', err);
                setProducts([
                    { id: 1, name: "Luxury Sofa", price: 299.00, rating: 5.0, image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80", category: "Sofa" },
                    { id: 2, name: "Premium Lamp", price: 79.00, rating: 4.8, image_url: "https://images.unsplash.com/photo-1542728928-1413d1894ed1?w=500&q=80", category: "Lamp" },
                    { id: 3, name: "Accent Chair", price: 199.00, rating: 4.9, image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80", category: "Chair" },
                ]);
            });
    }, []);

    return (
        <section className="container products-section">
            <h2 className="section-title">Our Best Selling Product</h2>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <div className="product-image-container">
                                <img src={product.image_url} alt={product.name} />
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
            </div>
        </section>
    );
};

export default Products;
