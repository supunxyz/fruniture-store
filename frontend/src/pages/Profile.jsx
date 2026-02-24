import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { User, LogOut, Package, MapPin, CreditCard, Save, X, Edit2, Camera, Trash2 } from 'lucide-react';

const Profile = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        profile_picture: user?.profile_picture || '',
        billing_address: user?.billing_address || '',
        payment_card: user?.payment_card || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleDeleteImage = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete your profile picture?")) return;

        setIsUploadingImage(true);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${user.id}/profile-picture`);
            setUser({ ...user, profile_picture: null });
            setFormData({ ...formData, profile_picture: '' });
        } catch (error) {
            console.error('Failed to delete image', error);
            alert('Failed to delete image.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/users/${user.id}/upload-profile-picture`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser({ ...user, profile_picture: res.data.profile_picture });
            setFormData({ ...formData, profile_picture: res.data.profile_picture });
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                profile_picture: user.profile_picture || '',
                billing_address: user.billing_address || '',
                payment_card: user.payment_card || ''
            });
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/users/${user.id}`, formData);
            setUser(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile.');
        }
        setIsSaving(false);
    };

    if (!user) return null;

    return (
        <div style={{ paddingBottom: '40px', background: 'var(--bg-light)', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '32px' }}>My Account</h1>

                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: '40px', alignItems: 'start' }}>

                    {/* Sidebar */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <label
                                    style={{ position: 'relative', cursor: 'pointer', borderRadius: '50%', overflow: 'hidden', width: '72px', height: '72px', flexShrink: 0, display: 'block' }}
                                    title="Click to change profile picture"
                                >
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                    {user.profile_picture ? (
                                        <img src={user.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--primary-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {isUploadingImage && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', ':hover': { opacity: 1 } }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                        <Camera size={20} color="white" />
                                    </div>
                                </label>
                                {user.profile_picture && (
                                    <button
                                        onClick={handleDeleteImage}
                                        style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#EF4444' }}
                                        title="Delete profile picture"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <div style={{ wordBreak: 'break-word', paddingRight: '12px' }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '4px' }}>{user.username}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: 'var(--primary-teal-light)', color: 'white', fontWeight: '500' }}>
                                <User size={20} /> Personal Info
                            </div>
                            {user.is_admin && (
                                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: 'var(--text-dark)', fontWeight: '500' }}>
                                    <Package size={20} /> Admin Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#B91C1C', fontWeight: '500', background: 'transparent', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s', width: '100%', border: 'none' }} onMouseOver={e => e.currentTarget.style.background = '#FEE2E2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <LogOut size={20} /> Sign Out
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Personal Info Card */}
                        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Personal Information</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--bg-light)', borderRadius: '8px', color: 'var(--primary-teal)', fontWeight: '600' }}>
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#F1F5F9', borderRadius: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            <X size={16} /> Cancel
                                        </button>
                                        <button onClick={handleSave} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--primary-teal)', borderRadius: '8px', color: 'white', fontWeight: '600' }}>
                                            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!isEditing ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Username</p>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{user.username}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Email Address</p>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{user.email}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={16} /> Billing Address
                                        </p>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{user.billing_address || "None specified"}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CreditCard size={16} /> Payment Card
                                        </p>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                                            {user.payment_card ? `**** **** **** ${user.payment_card.slice(-4) || 'Saved'}` : "None saved"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Billing Address</label>
                                        <input type="text" name="billing_address" value={formData.billing_address} onChange={handleChange} placeholder="123 Furniture St, Central City" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Payment Card Number</label>
                                        <input type="text" name="payment_card" value={formData.payment_card} onChange={handleChange} placeholder="1234 5678 9101 1121" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent Orders Placeholder */}
                        <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Recent Orders</h2>
                            </div>

                            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-light)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                                <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                                <h3 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>No orders found</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You haven't placed any orders yet.</p>
                                <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px' }}>
                                    Start Shopping
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
