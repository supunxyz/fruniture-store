import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { formatPrice } from '../utils/currency';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', address: '', city: '', zip: '', country: '',
        mobile1: '', mobile2: '', paymentMethod: 'Card'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cart.length === 0) {
            navigate('/cart');
        }
    }, [user, cart.length, navigate]);

    if (!user || cart.length === 0) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                user_id: user.id,
                items: cart.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
                address: `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`,
                mobile1: formData.mobile1,
                mobile2: formData.mobile2,
                payment_method: formData.paymentMethod
            };

            await axios.post('http://localhost:8000/api/orders', payload);

            clearCart();
            alert('Order placed successfully! Thank you for shopping with Furnish.');
            navigate('/');
        } catch (error) {
            console.error('Failed to submit order', error);
            alert('There was an issue processing your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '32px' }}>Checkout</h1>

                <div className="responsive-grid checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>

                    {/* Checkout Form */}
                    <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Shipping Information</h2>

                        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="responsive-grid checkout-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                            </div>

                            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />

                            <div className="responsive-grid checkout-mobile-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input type="text" name="mobile1" placeholder="Primary Mobile Number" required value={formData.mobile1} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                <input type="text" name="mobile2" placeholder="Secondary Mobile Number (Optional)" value={formData.mobile2} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                            </div>

                            <input type="text" name="address" placeholder="Shipping Address" required value={formData.address} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />

                            <div className="responsive-grid checkout-address-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                <input type="text" name="zip" placeholder="ZIP Code" required value={formData.zip} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                <input type="text" name="country" placeholder="Country" required value={formData.country} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', marginTop: '12px', color: 'var(--text-primary)' }}>Payment Method</h3>
                            <select name="paymentMethod" required value={formData.paymentMethod} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                                <option value="Card">Credit / Debit Card</option>
                                <option value="Cash on Delivery">Cash on Delivery</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="PayPal">PayPal</option>
                            </select>

                            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: '20px', padding: '16px', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                                {isSubmitting ? 'Processing...' : `Pay ${formatPrice(getCartTotal())}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', position: 'sticky', top: '120px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Order Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            {cart.map(item => (
                                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <img src={item.product.image_url} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div>
                                            <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.product.name}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontWeight: '600', color: 'var(--teal)' }}>{formatPrice(item.product.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                            <span>Subtotal</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-muted)' }}>
                            <span>Shipping</span>
                            <span style={{ color: 'var(--success-color)' }}>Free</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            <span>Total</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
