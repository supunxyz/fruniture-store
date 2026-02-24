import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await register(username, email, password);
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
                    <div className="auth-banner" style={{ flex: '1', padding: '40px', background: 'var(--primary-teal-light)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 'bold' }}>Create your account</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                Exclusive Offers & Vouchers
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                Fast Delivery Options
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                                Secure Payment Methods
                            </li>
                        </ul>
                        <div style={{ marginTop: '40px' }}>
                            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80" alt="Shopping Illustration" style={{ width: '100%', borderRadius: '12px', opacity: 0.9, objectFit: 'cover', height: '140px' }} />
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div className="auth-form-side" style={{ flex: '1.2', padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', margin: 0 }}>Register</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Already a member? <Link to="/login" style={{ color: 'var(--primary-teal)', fontWeight: '500' }}>Login</Link>
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="First Last"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid #cce1de', outline: 'none', fontSize: '0.95rem' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                    onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                />
                            </div>

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
                                    placeholder="Minimum 6 characters with a number and a letter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid #cce1de', outline: 'none', fontSize: '0.95rem' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                    onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                />
                            </div>

                            {/* Additional fields */}
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Birthday (Optional)</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%', padding: '9px 14px', borderRadius: '4px', border: '1px solid #cce1de', outline: 'none', fontSize: '0.95rem', color: 'var(--text-muted)' }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gender (Optional)</label>
                                    <select style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid #cce1de', outline: 'none', fontSize: '0.95rem', color: 'var(--text-muted)', background: 'white' }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = '#cce1de'}>
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                <input type="checkbox" id="offers" style={{ width: '16px', height: '16px', accentColor: 'var(--primary-teal)' }} />
                                <label htmlFor="offers" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>I'd like to receive exclusive offers and promotions via SMS</label>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '4px', marginTop: '10px' }}>
                                SIGN UP
                            </button>
                        </form>

                        <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left', lineHeight: 1.5 }}>
                            By clicking “SIGN UP”, I agree to Furnish.'s Terms of Use and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
