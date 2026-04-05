import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Phone, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+94');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // OTP step state
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP verification
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSending, setOtpSending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const otpRefs = useRef([]);

    const { sendOtp, registerVerified } = useAuth();
    const navigate = useNavigate();

    const countryCodes = [
        { code: '+94', flag: '🇱🇰', name: 'LK' },
    ];

    const fullPhone = `${countryCode}${phoneNumber}`;

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // Handle OTP input boxes
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    // Step 1: Validate form and send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        if (!phoneNumber || !/^\d{7,15}$/.test(phoneNumber)) {
            setError('A valid phone number is required for SMS verification.');
            return;
        }
        if (!username || !email || !password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setOtpSending(true);
        const res = await sendOtp(fullPhone);
        setOtpSending(false);
        if (res.success) {
            setStep(2);
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
        } else {
            setError(res.message);
        }
    };

    // Step 2: Verify OTP and register
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setError(null);
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }
        setLoading(true);
        const res = await registerVerified(username, email, password, fullPhone, otpCode);
        setLoading(false);
        if (res.success) {
            navigate('/profile');
        } else {
            setError(res.message);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setError(null);
        setOtpSending(true);
        const res = await sendOtp(fullPhone);
        setOtpSending(false);
        if (res.success) {
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
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
        height: '44px',
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
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>
                                {step === 1 ? 'Create Account' : 'Verify Phone'}
                            </h2>
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

                        {/* ── STEP 1: Registration Form ── */}
                        {step === 1 && (
                        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

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
                                    Phone Number <span style={{ color: '#B91C1C', fontWeight: '400', fontSize: '0.75rem' }}>*Required</span>
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {/* Number input */}
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <span style={iconWrap}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={16} />
                                                <span style={{ fontSize: '0.92rem', color: 'var(--text-dark)', fontWeight: '500' }}>+94</span>
                                            </span>
                                        </span>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="771234567"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            style={{ ...inputStyle, paddingLeft: '76px' }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                            onBlur={(e) => e.target.style.borderColor = '#cce1de'}
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                                {phoneNumber && (
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', margin: '4px 0 0 0' }}>
                                        Full number: <span style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>{countryCode}{phoneNumber}</span>
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

                            {/* Confirm Password */}
                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={iconWrap}><Lock size={16} /></span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{
                                            ...inputStyle,
                                            borderColor: confirmPassword && confirmPassword !== password ? '#B91C1C' : '#cce1de',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => e.target.style.borderColor = confirmPassword && confirmPassword !== password ? '#B91C1C' : '#cce1de'}
                                    />
                                </div>
                                {confirmPassword && confirmPassword !== password && (
                                    <p style={{ fontSize: '0.72rem', color: '#B91C1C', marginTop: '4px', margin: '4px 0 0 0' }}>Passwords do not match</p>
                                )}
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
                                disabled={otpSending}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.5px', opacity: otpSending ? 0.7 : 1 }}
                            >
                                {otpSending ? 'Sending Code…' : 'SEND VERIFICATION CODE'}
                            </button>
                        </form>
                        )}

                        {/* ── STEP 2: OTP Verification ── */}
                        {step === 2 && (
                        <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

                            {/* Back button */}
                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(null); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-teal)', fontSize: '0.85rem', fontWeight: '600', padding: 0 }}
                            >
                                <ArrowLeft size={16} /> Back to form
                            </button>

                            {/* OTP info */}
                            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                    <ShieldCheck size={28} color="white" />
                                </div>
                                <p style={{ fontSize: '0.92rem', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '6px' }}>
                                    Verification Code Sent
                                </p>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    We sent a 6-digit code to <strong>{fullPhone}</strong>.<br />
                                    Enter it below to verify your phone number.
                                </p>
                            </div>

                            {/* OTP Input Boxes */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpRefs.current[i] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        onPaste={i === 0 ? handleOtpPaste : undefined}
                                        style={{
                                            width: '48px',
                                            height: '54px',
                                            textAlign: 'center',
                                            fontSize: '1.4rem',
                                            fontWeight: '700',
                                            borderRadius: '10px',
                                            border: digit ? '2px solid var(--primary-teal)' : '1.5px solid #cce1de',
                                            outline: 'none',
                                            background: '#fafffe',
                                            color: 'var(--text-dark)',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-teal)'}
                                        onBlur={(e) => { if (!digit) e.target.style.borderColor = '#cce1de'; }}
                                    />
                                ))}
                            </div>

                            {/* Resend OTP */}
                            <div style={{ textAlign: 'center' }}>
                                {countdown > 0 ? (
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        Resend code in <strong>{countdown}s</strong>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={otpSending}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-teal)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'underline' }}
                                    >
                                        {otpSending ? 'Sending…' : 'Resend Code'}
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.5px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Creating Account…' : 'VERIFY & SIGN UP'}
                            </button>
                        </form>
                        )}

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
