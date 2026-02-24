import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await login(email, password);
        if (res.success) {
            navigate('/profile');
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={{ paddingBottom: '40px', background: 'var(--bg-light)', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                <div className="flex-col-mobile" style={{ background: 'var(--card-bg)', borderRadius: '4px', width: '100%', maxWidth: '800px', display: 'flex', overflow: 'hidden', minHeight: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

                    {/* Left Banner Section */}
                    <div style={{ flex: '1', padding: '40px', background: 'var(--primary-teal-light)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 'bold' }}>Welcome to Furnish.</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                Track Your Orders
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                Save Favorite Items
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                Fast Checkout Process
                            </li>
                        </ul>
                        <div style={{ marginTop: '40px' }}>
                            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Living Room" style={{ width: '100%', borderRadius: '12px', opacity: 0.9, objectFit: 'cover', height: '140px' }} />
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div style={{ flex: '1.2', padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', margin: 0 }}>Login</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                New member? <Link to="/register" style={{ color: 'var(--primary-teal)', fontWeight: '500' }}>Register</Link>
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address or Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Please enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid #cce1de', outline: 'none', fontSize: '0.95rem' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                    onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Please enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid #cce1de', outline: 'none', fontSize: '0.95rem' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                    onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '4px', marginTop: '10px' }}>
                                LOGIN
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
