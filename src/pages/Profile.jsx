import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, LogOut, Package, MapPin, CreditCard } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div style={{ paddingBottom: '40px', background: 'var(--bg-light)', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '120px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '32px' }}>My Account</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: '40px', alignItems: 'start' }}>

                    {/* Sidebar */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '4px' }}>{user.username}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: 'var(--primary-teal-light)', color: 'white', fontWeight: '500' }}>
                                <User size={20} /> Personal Info
                            </Link>
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
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '24px' }}>Personal Information</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Username</p>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{user.username}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Email Address</p>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{user.email}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Account Status</p>
                                    <div style={{ display: 'inline-block', padding: '4px 12px', background: user.is_active ? '#D1FAE5' : '#FEE2E2', color: user.is_active ? '#065F46' : '#991B1B', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Role</p>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: '500' }}>{user.is_admin ? 'Admin' : 'Customer'}</p>
                                </div>
                            </div>
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
