import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Plus, Edit, Trash2, Star } from 'lucide-react';
import axios from 'axios';
import '../admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [heroData, setHeroData] = useState(null);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', original_price: '', category: '', image_url: '', stock: '', description: ''
    });
    const [newProductImages, setNewProductImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, userRes, orderRes, heroRes] = await Promise.all([
                axios.get('http://localhost:8000/api/products'),
                axios.get('http://localhost:8000/api/users'),
                axios.get('http://localhost:8000/api/orders'),
                axios.get('http://localhost:8000/api/hero')
            ]);
            setProducts(prodRes.data);
            setUsers(userRes.data);
            setOrders(orderRes.data);
            setHeroData(heroRes.data);
            setStats({
                products: prodRes.data.length,
                users: userRes.data.length,
                orders: orderRes.data.length
            });
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/products/${id}`);
            // Optimistic update
            setProducts(products.filter(p => p.id !== id));
            setStats({ ...stats, products: stats.products - 1 });
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Error deleting product");
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/products', {
                ...newProduct,
                image_url: newProduct.image_url || ((newProductImages && newProductImages.length > 0) ? 'pending' : ''),
                price: parseFloat(newProduct.price),
                original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
                stock: parseInt(newProduct.stock),
                rating: 5.0
            });

            let finalProduct = res.data;

            if (newProductImages && newProductImages.length > 0) {
                const formData = new FormData();
                Array.from(newProductImages).forEach(file => {
                    formData.append('files', file);
                });

                const uploadRes = await axios.post(`http://localhost:8000/api/products/${res.data.id}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalProduct = uploadRes.data;
            }

            setProducts([...products, finalProduct]);
            setStats({ ...stats, products: stats.products + 1 });
            setProductModalOpen(false);
            setNewProduct({ name: '', price: '', original_price: '', category: '', image_url: '', stock: '', description: '' });
            setNewProductImages([]);
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Error creating product");
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/api/products/${editingProduct.id}`, {
                ...editingProduct,
                price: parseFloat(editingProduct.price),
                original_price: editingProduct.original_price ? parseFloat(editingProduct.original_price) : null,
                stock: parseInt(editingProduct.stock),
            });
            setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
            setEditingProduct(null);
        } catch (error) {
            console.error("Failed to update product", error);
            alert("Error updating product");
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct({
            ...product,
            original_price: product.original_price || '',
            description: product.description || ''
        });
    };

    const handleUpdateHero = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/api/hero/${heroData.id}`, heroData);
            setHeroData(res.data);
            alert("Hero settings updated successfully!");
        } catch (error) {
            console.error("Failed to update hero", error);
            alert("Error updating hero settings.");
        }
    };

    const renderDashboard = () => (
        <div className="admin-grid">
            <div className="admin-stat-card">
                <div className="stat-icon bg-teal-light"><Package className="text-teal" size={24} /></div>
                <div>
                    <p className="stat-label">Total Products</p>
                    <h3 className="stat-value">{stats.products}</h3>
                </div>
            </div>
            <div className="admin-stat-card">
                <div className="stat-icon bg-gold-light"><Users className="text-gold" size={24} /></div>
                <div>
                    <p className="stat-label">Total Users</p>
                    <h3 className="stat-value">{stats.users}</h3>
                </div>
            </div>
            <div className="admin-stat-card">
                <div className="stat-icon bg-blue-light"><ShoppingCart className="text-blue" size={24} /></div>
                <div>
                    <p className="stat-label">Total Orders</p>
                    <h3 className="stat-value">{stats.orders}</h3>
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Manage Products</h3>
                <button className="btn-primary" onClick={() => setProductModalOpen(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }}>
                    <Plus size={16} /> Add Product
                </button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td><img src={p.image_url} alt={p.name} className="table-img" /></td>
                            <td className="font-medium">{p.name}</td>
                            <td><span className="table-badge">{p.category}</span></td>
                            <td className="font-bold text-teal">${p.price.toFixed(2)}</td>
                            <td>{p.stock}</td>
                            <td>
                                <div className="table-actions">
                                    <button className="icon-btn edit" onClick={() => handleEditClick(p)}><Edit size={16} /></button>
                                    <button className="icon-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderUsers = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Manage Users</h3>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td className="font-medium">{u.username}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`table-badge ${u.is_active ? 'success' : 'danger'}`}>
                                    {u.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>{u.is_admin ? 'Admin' : 'Customer'}</td>
                            <td>
                                <div className="table-actions">
                                    <button className="icon-btn edit"><Edit size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No users found. Try creating an account!</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderOrders = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Manage Orders</h3>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td>#{o.id}</td>
                            <td>User #{o.user_id}</td>
                            <td className="font-bold text-teal">${o.total_amount.toFixed(2)}</td>
                            <td>
                                <span className={`table-badge ${o.status === 'pending' ? 'warning' : 'success'}`}>
                                    {o.status.toUpperCase()}
                                </span>
                            </td>
                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                            <td>
                                <div className="table-actions">
                                    <button className="icon-btn edit"><Edit size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No orders have been placed yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderHeroSettings = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Hero Section Settings</h3>
            </div>
            {heroData ? (
                <form onSubmit={handleUpdateHero} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Title (First Line)</label>
                            <input type="text" value={heroData.title_black} onChange={e => setHeroData({ ...heroData, title_black: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: 'var(--primary-teal)' }}>Title (Highlighted)</label>
                            <input type="text" value={heroData.title_colored} onChange={e => setHeroData({ ...heroData, title_colored: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Title (End Line)</label>
                            <input type="text" value={heroData.title_black_2} onChange={e => setHeroData({ ...heroData, title_black_2: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Subtitle</label>
                        <textarea value={heroData.subtitle} onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'inherit' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Current Price</label>
                            <input type="number" step="0.01" value={heroData.current_price} onChange={e => setHeroData({ ...heroData, current_price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Old Price</label>
                            <input type="number" step="0.01" value={heroData.old_price} onChange={e => setHeroData({ ...heroData, old_price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Rating (e.g. 4.8)</label>
                            <input type="number" step="0.1" value={heroData.rating} onChange={e => setHeroData({ ...heroData, rating: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Reviews Count</label>
                            <input type="number" value={heroData.reviews_count} onChange={e => setHeroData({ ...heroData, reviews_count: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Image URL</label>
                        <input type="text" value={heroData.image_url} onChange={e => setHeroData({ ...heroData, image_url: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                        {heroData.image_url && (
                            <div style={{ marginTop: '16px', background: 'var(--bg-light)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                <img src={heroData.image_url} alt="Hero Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} />
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>Save Changes</button>
                    </div>
                </form>
            ) : (
                <p>Loading settings...</p>
            )}
        </div>
    );

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2><span>F</span>Furnish.<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}> Admin</span></h2>
                </div>
                <nav className="admin-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
                        <Package size={20} /> Products
                    </button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <Users size={20} /> Users
                    </button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                        <ShoppingCart size={20} /> Orders
                    </button>
                    <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>
                        <Star size={20} /> Hero Settings
                    </button>
                </nav>
                <div className="admin-footer">
                    <button className="logout-btn" onClick={() => window.location.href = "/"}>
                        <LogOut size={20} /> Back to Store
                    </button>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h2>
                        {activeTab === 'dashboard' && 'Dashboard Overview'}
                        {activeTab === 'products' && 'Product Inventory'}
                        {activeTab === 'users' && 'User Management'}
                        {activeTab === 'orders' && 'Order Tracking'}
                        {activeTab === 'hero' && 'Storefront Settings'}
                    </h2>
                    <div className="admin-user-profile">
                        <div className="admin-avatar">A</div>
                        <div>
                            <p className="admin-name">Admin User</p>
                            <p className="admin-role">Superadmin</p>
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'hero' && renderHeroSettings()}
                </div>
            </main>

            {/* Product Modal overlay */}
            {isProductModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleCreateProduct}>
                            <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="number" step="0.01" placeholder="Price" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={{ flex: 1 }} />
                                <input type="number" step="0.01" placeholder="Original Price (Opt)" value={newProduct.original_price} onChange={e => setNewProduct({ ...newProduct, original_price: e.target.value })} style={{ flex: 1 }} />
                            </div>
                            <input type="text" placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                            <input type="number" placeholder="Stock Quantity" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            <textarea placeholder="Description (Optional)" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit' }} rows={3} />

                            <div style={{ marginBottom: '16px' }}>
                                <input type="text" placeholder="Image URL (Or upload below)" required={!newProductImages || newProductImages.length === 0} value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} style={{ marginBottom: '8px' }} />
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OR upload photos:</div>
                                <input type="file" multiple accept="image/*" onChange={e => setNewProductImages(e.target.files)} style={{ width: '100%', padding: '12px', border: '1px dashed var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', marginTop: '4px' }} />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setProductModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal overlay */}
            {editingProduct && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Edit Product</h3>
                        <form onSubmit={handleUpdateProduct}>
                            <input type="text" placeholder="Product Name" required value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="number" step="0.01" placeholder="Price" required value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} style={{ flex: 1 }} />
                                <input type="number" step="0.01" placeholder="Original Price (Opt)" value={editingProduct.original_price} onChange={e => setEditingProduct({ ...editingProduct, original_price: e.target.value })} style={{ flex: 1 }} />
                            </div>
                            <input type="text" placeholder="Category" required value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                            <input type="number" placeholder="Stock Quantity" required value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                            <textarea placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit' }} rows={3} />
                            <input type="text" placeholder="Image URL" required value={editingProduct.image_url} onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })} />
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button type="submit" className="btn-primary">Update Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
