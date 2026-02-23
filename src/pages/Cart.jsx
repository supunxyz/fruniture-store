import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '120px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '32px' }}>Your Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                        <ShoppingBag size={64} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Your cart is empty</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Looks like you haven't added any furniture to your cart yet.</p>
                        <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px', alignItems: 'start' }}>

                        {/* Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cart.map(item => (
                                <div key={item.product.id} style={{ display: 'flex', gap: '24px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.product.name}</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{item.product.category}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-color)', borderRadius: '30px', padding: '4px 12px' }}>
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}>
                                                    <Minus size={16} />
                                                </button>
                                                <span style={{ fontWeight: '600', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}>
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--teal)' }}>
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', position: 'sticky', top: '120px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Order Summary</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-muted)' }}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '24px' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                <span>Total</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>

                            <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                                Proceed to Checkout
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
