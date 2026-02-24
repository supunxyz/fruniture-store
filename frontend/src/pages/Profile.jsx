import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { formatPrice } from '../utils/currency';
import {
    User, LogOut, Package, MapPin, CreditCard, Save, X,
    Edit2, Camera, Trash2, ChevronDown, ChevronUp,
    Clock, CheckCircle, Truck, PackageCheck, XCircle,
    ShoppingBag, RefreshCw
} from 'lucide-react';

// ─── Order status config ─────────────────────────────────────────────────────
const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_META = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
    confirmed: { label: 'Confirmed', color: '#3B82F6', bg: '#EFF6FF', icon: CheckCircle },
    shipped: { label: 'Shipped', color: '#8B5CF6', bg: '#F5F3FF', icon: Truck },
    delivered: { label: 'Delivered', color: '#10B981', bg: '#ECFDF5', icon: PackageCheck },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

// ─── Order Status Badge ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status] || STATUS_META.pending;
    const Icon = meta.icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '99px',
            background: meta.bg, color: meta.color,
            fontSize: '0.8rem', fontWeight: '600',
        }}>
            <Icon size={13} />
            {meta.label}
        </span>
    );
};

// ─── Progress Stepper ────────────────────────────────────────────────────────
const OrderStepper = ({ status }) => {
    if (status === 'cancelled') return null;
    const currentIdx = STATUS_STEPS.indexOf(status);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '20px 0 8px' }}>
            {STATUS_STEPS.map((step, idx) => {
                const meta = STATUS_META[step];
                const Icon = meta.icon;
                const done = idx <= currentIdx;
                const active = idx === currentIdx;
                const isLast = idx === STATUS_STEPS.length - 1;

                return (
                    <React.Fragment key={step}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: done ? meta.color : '#E2E8F0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s',
                                boxShadow: active ? `0 0 0 4px ${meta.color}30` : 'none',
                            }}>
                                <Icon size={16} color={done ? 'white' : '#94A3B8'} />
                            </div>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: active ? '700' : '500',
                                color: done ? meta.color : '#94A3B8', whiteSpace: 'nowrap',
                            }}>
                                {meta.label}
                            </span>
                        </div>
                        {!isLast && (
                            <div style={{
                                flex: 1, height: '3px', margin: '0 4px', marginBottom: '22px',
                                background: idx < currentIdx
                                    ? `linear-gradient(90deg, ${STATUS_META[STATUS_STEPS[idx]].color}, ${STATUS_META[STATUS_STEPS[idx + 1]].color})`
                                    : '#E2E8F0',
                                borderRadius: '2px', transition: 'background 0.4s',
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ─── Single Order Card ────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);

    const placedDate = new Date(order.created_at).toLocaleDateString('en-LK', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <div style={{
            border: '1px solid var(--border-color)', borderRadius: '16px',
            overflow: 'hidden', transition: 'box-shadow 0.2s',
            background: 'var(--card-bg)',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            {/* ── Card Header ── */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                justifyContent: 'space-between', gap: '12px',
                padding: '16px 20px', background: 'var(--bg-light)',
                borderBottom: expanded ? '1px solid var(--border-color)' : 'none',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        ORDER #{order.id}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Placed on {placedDate}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total</p>
                        <p style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '1rem' }}>
                            {formatPrice(order.total_amount)}
                        </p>
                    </div>
                    <StatusBadge status={order.status} />
                    <button
                        onClick={() => setExpanded(v => !v)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: '1px solid var(--border-color)', background: 'white',
                            color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0,
                            transition: 'all 0.2s',
                        }}
                        title={expanded ? 'Collapse' : 'View details'}
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* ── Expanded Content ── */}
            {expanded && (
                <div style={{ padding: '20px' }}>
                    {/* Progress stepper */}
                    <OrderStepper status={order.status} />

                    {/* ── Items ── */}
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Items
                        </p>
                        {order.items?.map(item => (
                            <div key={item.id} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '12px', borderRadius: '12px', background: 'var(--bg-light)',
                            }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '10px',
                                    overflow: 'hidden', flexShrink: 0, background: '#E2E8F0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {item.product?.image_url ? (
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product?.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Package size={20} color="#94A3B8" />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.product?.name || 'Product'}
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                        Qty: {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                </div>
                                <p style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.95rem', flexShrink: 0 }}>
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Order meta ── */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px', marginTop: '20px', padding: '16px',
                        background: 'var(--bg-light)', borderRadius: '12px',
                    }}>
                        {order.address && (
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={12} /> Delivery Address
                                </p>
                                <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)' }}>
                                    {order.address}
                                </p>
                            </div>
                        )}
                        {order.payment_method && (
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CreditCard size={12} /> Payment
                                </p>
                                <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', textTransform: 'capitalize' }}>
                                    {order.payment_method}
                                </p>
                            </div>
                        )}
                        {order.mobile1 && (
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>📞 Contact</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)' }}>
                                    {order.mobile1}{order.mobile2 ? ` / ${order.mobile2}` : ''}
                                </p>
                            </div>
                        )}
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🧾 Order Total</p>
                            <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-teal)' }}>
                                {formatPrice(order.total_amount)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Profile Page ────────────────────────────────────────────────────────
const Profile = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    // ── Profile edit state ──
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        profile_picture: '',
        billing_address: '',
        payment_card: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    // ── Orders state ──
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState(null);

    // ── Auth guard + form seed ──
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                profile_picture: user.profile_picture || '',
                billing_address: user.billing_address || '',
                payment_card: user.payment_card || '',
            });
        }
    }, [user, navigate]);

    // ── Fetch orders whenever tab switches to 'orders' ──
    useEffect(() => {
        if (activeTab !== 'orders' || !user) return;
        fetchOrders();
    }, [activeTab, user]);

    const fetchOrders = async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/orders/');
            // Filter only this user's orders, newest first
            const mine = res.data
                .filter(o => o.user_id === user.id)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(mine);
        } catch (err) {
            setOrdersError('Failed to load your orders. Please try again.');
        } finally {
            setOrdersLoading(false);
        }
    };

    // ── Profile picture handlers ──
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/api/users/${user.id}/upload-profile-picture`,
                uploadData, { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setUser({ ...user, profile_picture: res.data.profile_picture });
            setFormData(f => ({ ...f, profile_picture: res.data.profile_picture }));
        } catch {
            alert('Failed to upload image.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleDeleteImage = async (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!window.confirm('Delete your profile picture?')) return;
        setIsUploadingImage(true);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${user.id}/profile-picture`);
            setUser({ ...user, profile_picture: null });
            setFormData(f => ({ ...f, profile_picture: '' }));
        } catch {
            alert('Failed to delete image.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/users/${user.id}`, formData);
            setUser(res.data);
            setIsEditing(false);
        } catch {
            alert('Failed to update profile.');
        }
        setIsSaving(false);
    };

    const handleLogout = () => { logout(); navigate('/'); };

    if (!user) return null;

    // ── Nav items ──
    const navItems = [
        { key: 'profile', label: 'Personal Info', Icon: User },
        { key: 'orders', label: 'My Orders', Icon: ShoppingBag },
    ];

    return (
        <div style={{ paddingBottom: '60px', background: 'var(--bg-light)', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '32px' }}>
                    My Account
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(0,3fr)',
                    gap: '32px', alignItems: 'start',
                }}
                    className="profile-grid"
                >
                    {/* ════════ Sidebar ════════ */}
                    <div style={{
                        background: 'var(--card-bg)', borderRadius: '24px',
                        padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        position: 'sticky', top: '88px',
                    }}>
                        {/* Avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <label style={{
                                    position: 'relative', cursor: 'pointer', borderRadius: '50%',
                                    overflow: 'hidden', width: '72px', height: '72px',
                                    flexShrink: 0, display: 'block',
                                }} title="Click to change profile picture">
                                    <input type="file" onChange={handleImageChange}
                                        style={{ display: 'none' }} accept="image/*" />
                                    {user.profile_picture ? (
                                        <img src={user.profile_picture} alt="Profile"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            background: 'var(--primary-teal)', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.5rem', fontWeight: 'bold',
                                        }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {isUploadingImage && (
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <div style={{
                                                width: '20px', height: '20px',
                                                border: '2px solid white', borderTopColor: 'transparent',
                                                borderRadius: '50%', animation: 'spin 1s linear infinite',
                                            }} />
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: 0, transition: 'opacity 0.2s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                    >
                                        <Camera size={20} color="white" />
                                    </div>
                                </label>
                                {user.profile_picture && (
                                    <button onClick={handleDeleteImage} style={{
                                        position: 'absolute', bottom: '-4px', right: '-4px',
                                        background: 'white', border: '1px solid var(--border-color)',
                                        borderRadius: '50%', padding: '6px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#EF4444',
                                    }} title="Delete profile picture">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <div style={{ wordBreak: 'break-word', paddingRight: '6px' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '4px' }}>
                                    {user.username}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</p>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {navItems.map(({ key, label, Icon }) => (
                                <button key={key} onClick={() => setActiveTab(key)} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', borderRadius: '12px', width: '100%',
                                    textAlign: 'left', cursor: 'pointer', fontWeight: '500',
                                    fontSize: '0.95rem', border: 'none',
                                    background: activeTab === key ? 'var(--primary-teal)' : 'transparent',
                                    color: activeTab === key ? 'white' : 'var(--text-dark)',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { if (activeTab !== key) e.currentTarget.style.background = 'var(--bg-light)'; }}
                                    onMouseLeave={e => { if (activeTab !== key) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <Icon size={18} /> {label}
                                </button>
                            ))}

                            {user.is_admin && (
                                <Link to="/admin" style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', borderRadius: '12px',
                                    color: 'var(--text-dark)', fontWeight: '500', fontSize: '0.95rem',
                                }}>
                                    <Package size={18} /> Admin Dashboard
                                </Link>
                            )}

                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />

                            <button onClick={handleLogout} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px', borderRadius: '12px',
                                color: '#B91C1C', fontWeight: '500', background: 'transparent',
                                textAlign: 'left', cursor: 'pointer', width: '100%', border: 'none',
                                transition: 'background 0.2s',
                            }}
                                onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </nav>
                    </div>

                    {/* ════════ Main Panel ════════ */}
                    <div>

                        {/* ── Personal Info Tab ── */}
                        {activeTab === 'profile' && (
                            <div style={{
                                background: 'var(--card-bg)', borderRadius: '24px',
                                padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>
                                        Personal Information
                                    </h2>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '8px 18px', background: 'var(--bg-light)',
                                            borderRadius: '8px', color: 'var(--primary-teal)',
                                            fontWeight: '600', border: '1px solid var(--border-color)',
                                        }}>
                                            <Edit2 size={15} /> Edit Profile
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => setIsEditing(false)} style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '8px 16px', background: '#F1F5F9',
                                                borderRadius: '8px', color: 'var(--text-muted)', fontWeight: '600',
                                            }}>
                                                <X size={15} /> Cancel
                                            </button>
                                            <button onClick={handleSave} disabled={isSaving} style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '8px 16px', background: 'var(--primary-teal)',
                                                borderRadius: '8px', color: 'white', fontWeight: '600',
                                                opacity: isSaving ? 0.7 : 1,
                                            }}>
                                                <Save size={15} /> {isSaving ? 'Saving…' : 'Save'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
                                        {[
                                            { label: 'Username', value: user.username },
                                            { label: 'Email Address', value: user.email },
                                            {
                                                label: 'Billing Address', icon: <MapPin size={14} />,
                                                value: user.billing_address || 'None specified',
                                            },
                                            {
                                                label: 'Payment Card', icon: <CreditCard size={14} />,
                                                value: user.payment_card
                                                    ? `**** **** **** ${user.payment_card.slice(-4)}`
                                                    : 'None saved',
                                            },
                                        ].map(({ label, value, icon }) => (
                                            <div key={label}>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    {icon} {label}
                                                </p>
                                                <p style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        {[
                                            { name: 'billing_address', label: 'Billing Address', placeholder: '123 Furniture St, Colombo' },
                                            { name: 'payment_card', label: 'Payment Card Number', placeholder: '1234 5678 9101 1121' },
                                        ].map(({ name, label, placeholder }) => (
                                            <div key={name}>
                                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                                    {label}
                                                </label>
                                                <input
                                                    type="text" name={name}
                                                    value={formData[name]}
                                                    onChange={e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    style={{
                                                        width: '100%', padding: '12px 14px',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '10px', fontSize: '0.95rem', outline: 'none',
                                                        fontFamily: 'inherit', background: 'var(--bg-light)',
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── My Orders Tab ── */}
                        {activeTab === 'orders' && (
                            <div style={{
                                background: 'var(--card-bg)', borderRadius: '24px',
                                padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '4px' }}>
                                            My Orders
                                        </h2>
                                        {!ordersLoading && (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {orders.length} order{orders.length !== 1 ? 's' : ''} found
                                            </p>
                                        )}
                                    </div>
                                    <button onClick={fetchOrders} disabled={ordersLoading} style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        padding: '8px 16px', borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-light)', color: 'var(--text-muted)',
                                        fontWeight: '500', cursor: 'pointer', fontSize: '0.85rem',
                                    }}>
                                        <RefreshCw size={14} style={{ animation: ordersLoading ? 'spin 1s linear infinite' : 'none' }} />
                                        Refresh
                                    </button>
                                </div>

                                {/* Loading */}
                                {ordersLoading && (
                                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', margin: '0 auto 16px',
                                            border: '3px solid var(--border-color)',
                                            borderTopColor: 'var(--primary-teal)',
                                            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                                        }} />
                                        <p style={{ color: 'var(--text-muted)' }}>Loading your orders…</p>
                                    </div>
                                )}

                                {/* Error */}
                                {!ordersLoading && ordersError && (
                                    <div style={{
                                        padding: '20px', borderRadius: '12px',
                                        background: '#FEF2F2', border: '1px solid #FECACA',
                                        color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '10px',
                                    }}>
                                        <XCircle size={18} /> {ordersError}
                                    </div>
                                )}

                                {/* Empty */}
                                {!ordersLoading && !ordersError && orders.length === 0 && (
                                    <div style={{
                                        textAlign: 'center', padding: '60px 20px',
                                        background: 'var(--bg-light)', borderRadius: '16px',
                                        border: '1px dashed var(--border-color)',
                                    }}>
                                        <ShoppingBag size={52} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                                        <h3 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>No orders yet</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                                            You haven't placed any orders yet.
                                        </p>
                                        <Link to="/shop" style={{
                                            display: 'inline-block', padding: '10px 24px',
                                            background: 'var(--primary-teal)', color: 'white',
                                            borderRadius: '10px', fontWeight: '600',
                                        }}>
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}

                                {/* Orders list */}
                                {!ordersLoading && !ordersError && orders.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {orders.map(order => (
                                            <OrderCard key={order.id} order={order} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .profile-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
