import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Phone, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+94');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const countryCodes = [
        { code: '+94', flag: '🇱🇰', name: 'LK' },
        { code: '+91', flag: '🇮🇳', name: 'IN' },
        { code: '+1', flag: '🇺🇸', name: 'US' },
        { code: '+44', flag: '🇬🇧', name: 'GB' },
        { code: '+61', flag: '🇦🇺', name: 'AU' },
        { code: '+971', flag: '🇦🇪', name: 'AE' },
        { code: '+60', flag: '🇲🇾', name: 'MY' },
        { code: '+65', flag: '🇸🇬', name: 'SG' },
        { code: '+92', flag: '🇵🇰', name: 'PK' },
        { code: '+880', flag: '🇧🇩', name: 'BD' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (phoneNumber && !/^\d{7,15}$/.test(phoneNumber)) {
            setError('Please enter a valid phone number (digits only, 7–15 chars).');
            return;
        }
        setLoading(true);
        const fullPhone = phoneNumber ? `${countryCode}${phoneNumber}` : '';
        const res = await register(username, email, password, fullPhone || undefined);
        setLoading(false);
        if (res.success) {
            navigate('/profile');
        } else {
            setError(res.message);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '11px 14px 11px 40px',
        borderRadius: '8px',
        border: '1.5px solid #cce1de',
        outline: 'none',
        fontSize: '0.92rem',
        background: '#fafffe',
        color: 'var(--text-dark)',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    };
    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontSize: '0.82rem',
        fontWeight: '600',
        color: 'var(--text-dark)',
    };
    const iconWrap = {
        position: 'absolute',
        left: '13px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--primary-teal)',
        pointerEvents: 'none',
        display: 'flex',
    };

    return (
        <div style={{ paddingBottom: '40px', background: 'var(--bg-light)', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                <div
                    className="flex-col-mobile"
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '860px',
                        display: 'flex',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(12,75,96,0.10)',
                    }}
                >
                    {/* ── Left Banner ── */}
                    <div
                        className="auth-banner"
                        style={{
                            flex: '1',
                            padding: '48px 36px',
                            background: 'linear-gradient(145deg, var(--primary-teal) 0%, var(--primary-teal-light) 100%)',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: '24px',
                        }}
                    >
                        <div>
                            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '8px', lineHeight: 1.2 }}>
                                Join Furnish. Today
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                Create your account and unlock a world of premium furniture.
                            </p>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
                            {['Exclusive Offers & Vouchers', 'Fast Delivery Options', 'Secure Payment Methods', 'Order Tracking & History'].map(item => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.92)' }}>
                                    <div style={{ width: '22px', height: '22px', minWidth: '22px', background: 'rgba(255,255,255,0.22)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <img
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
                            alt="Furniture"
                            style={{ width: '100%', borderRadius: '12px', opacity: 0.85, objectFit: 'cover', height: '130px', marginTop: '8px' }}
                        />
                    </div>

                    {/* ── Right Form ── */}
                    <div
                        className="auth-form-side"
                        style={{ flex: '1.3', padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>Create Account</h2>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                Already a member?{' '}
                                <Link to="/login" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>Login</Link>
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', borderLeft: '3px solid #B91C1C' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                            {/* Full Name */}
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={iconWrap}><User size={16} /></span>
                                    <input
                                        type="text"
                                        required
                                        placeholder="First Last"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={iconWrap}><Mail size={16} /></span>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label style={labelStyle}>
                                    Phone Number <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span>
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {/* Country code dropdown */}
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        style={{
                                            padding: '11px 10px',
                                            borderRadius: '8px',
                                            border: '1.5px solid #cce1de',
                                            outline: 'none',
                                            fontSize: '0.88rem',
                                            background: '#fafffe',
                                            color: 'var(--text-dark)',
                                            cursor: 'pointer',
                                            minWidth: '100px',
                                            flexShrink: 0,
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                    >
                                        {countryCodes.map(c => (
                                            <option key={c.code} value={c.code}>
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Number input */}
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <span style={iconWrap}><Phone size={16} /></span>
                                        <input
                                            type="tel"
                                            placeholder="771234567"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            style={inputStyle}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                            onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                                {phoneNumber && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', marginTop: '4px' }}>
                                        Full number: {countryCode}{phoneNumber}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label style={labelStyle}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={iconWrap}><Lock size={16} /></span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Minimum 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ ...inputStyle, paddingRight: '42px' }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        style={{
                                            position: 'absolute', right: '12px', top: '50%',
                                            transform: 'translateY(-50%)', background: 'none',
                                            border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                                            display: 'flex',
                                        }}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* SMS Opt-in */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="offers"
                                    style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: 'var(--primary-teal)', flexShrink: 0 }}
                                />
                                <label htmlFor="offers" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    I'd like to receive exclusive offers and promotions via SMS
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.5px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Creating Account…' : 'SIGN UP'}
                            </button>
                        </form>

                        <p style={{ marginTop: '18px', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            By clicking "SIGN UP", I agree to Furnish.'s{' '}
                            <span style={{ color: 'var(--primary-teal)', cursor: 'pointer' }}>Terms of Use</span> and{' '}
                            <span style={{ color: 'var(--primary-teal)', cursor: 'pointer' }}>Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
