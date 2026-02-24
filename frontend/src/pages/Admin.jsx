import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Plus, Edit, Trash2, Star, Megaphone, ToggleLeft, ToggleRight, Search, X, Upload, Eye, AlertTriangle, CheckCircle, ChevronDown, ImageOff } from 'lucide-react';
import axios from 'axios';
import '../admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [heroData, setHeroData] = useState(null);
    const [promos, setPromos] = useState([]);
    const [newPromoText, setNewPromoText] = useState('');
    const [newPromoIcon, setNewPromoIcon] = useState('Tag');
    const [editingPromo, setEditingPromo] = useState(null);

    // Product panel state
    const [productPanelOpen, setProductPanelOpen] = useState(false);
    const [productPanelMode, setProductPanelMode] = useState('add'); // 'add' | 'edit'
    const [productSaving, setProductSaving] = useState(false);
    const [productSaveMsg, setProductSaveMsg] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [productCatFilter, setProductCatFilter] = useState('All');
    const [dragOver, setDragOver] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const EMPTY_PRODUCT = { name: '', price: '', original_price: '', category: '', image_url: '', stock: '', description: '' };
    const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
    const [productFormFiles, setProductFormFiles] = useState([]);
    const [productFormFilePreviews, setProductFormFilePreviews] = useState([]);

    // legacy kept for compatibility
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
    const [newProductImages, setNewProductImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [prodRes, userRes, orderRes, heroRes, promoRes] = await Promise.allSettled([
            axios.get('http://localhost:8000/api/products'),
            axios.get('http://localhost:8000/api/users'),
            axios.get('http://localhost:8000/api/orders'),
            axios.get('http://localhost:8000/api/hero'),
            axios.get('http://localhost:8000/api/promos/all'),
        ]);
        if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
        if (userRes.status === 'fulfilled') setUsers(userRes.value.data);
        if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data);
        if (heroRes.status === 'fulfilled') setHeroData(heroRes.value.data);
        if (promoRes.status === 'fulfilled') setPromos(promoRes.value.data);
        setStats({
            products: prodRes.status === 'fulfilled' ? prodRes.value.data.length : 0,
            users: userRes.status === 'fulfilled' ? userRes.value.data.length : 0,
            orders: orderRes.status === 'fulfilled' ? orderRes.value.data.length : 0,
        });
        if (prodRes.status === 'rejected') console.error('Failed to fetch products', prodRes.reason);
        if (userRes.status === 'rejected') console.error('Failed to fetch users', userRes.reason);
        if (orderRes.status === 'rejected') console.error('Failed to fetch orders', orderRes.reason);
        if (heroRes.status === 'rejected') console.error('Failed to fetch hero data', heroRes.reason);
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

    // ── Product panel helpers ──
    const openAddPanel = () => {
        setProductForm(EMPTY_PRODUCT);
        setProductFormFiles([]);
        setProductFormFilePreviews([]);
        setProductSaveMsg('');
        setProductPanelMode('add');
        setProductPanelOpen(true);
    };

    const openEditPanel = (product) => {
        setProductForm({ ...product, original_price: product.original_price ?? '', description: product.description ?? '' });
        setProductFormFiles([]);
        setProductFormFilePreviews([]);
        setProductSaveMsg('');
        setProductPanelMode('edit');
        setProductPanelOpen(true);
    };

    const closeProductPanel = () => {
        setProductPanelOpen(false);
        setProductSaveMsg('');
    };

    const handleFileChange = (files) => {
        const arr = Array.from(files);
        setProductFormFiles(arr);
        const previews = arr.map(f => URL.createObjectURL(f));
        setProductFormFilePreviews(previews);
        // Clear URL field when files chosen
        setProductForm(f => ({ ...f, image_url: '' }));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setProductSaving(true);
        setProductSaveMsg('');
        try {
            const payload = {
                name: productForm.name,
                price: parseFloat(productForm.price),
                original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
                category: productForm.category,
                stock: parseInt(productForm.stock),
                description: productForm.description || null,
                image_url: productForm.image_url || (productFormFiles.length > 0 ? 'pending' : ''),
                rating: productPanelMode === 'add' ? 0.0 : (productForm.rating ?? 0.0),
            };

            let saved;
            if (productPanelMode === 'add') {
                const res = await axios.post('http://localhost:8000/api/products', payload);
                saved = res.data;
                if (productFormFiles.length > 0) {
                    const fd = new FormData();
                    productFormFiles.forEach(f => fd.append('files', f));
                    const imgRes = await axios.post(`http://localhost:8000/api/products/${saved.id}/images`, fd, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    saved = imgRes.data;
                }
                setProducts(prev => [...prev, saved]);
                setStats(s => ({ ...s, products: s.products + 1 }));
            } else {
                const res = await axios.put(`http://localhost:8000/api/products/${productForm.id}`, payload);
                saved = res.data;
                setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
            }
            setProductSaveMsg('success');
            setTimeout(() => {
                setProductPanelOpen(false);
                setProductSaveMsg('');
            }, 1200);
        } catch (err) {
            setProductSaveMsg('error:' + (err.response?.data?.detail || 'Failed to save'));
        } finally {
            setProductSaving(false);
        }
    };

    // Legacy handlers kept but delegate to panel
    const handleEditClick = (product) => openEditPanel(product);

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

    // ── Filtered products for table ──
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
    const filteredProducts = products.filter(p => {
        const matchCat = productCatFilter === 'All' || p.category === productCatFilter;
        const q = productSearch.toLowerCase();
        const matchQ = !q || p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
        return matchCat && matchQ;
    });

    const discountPct = (p) => {
        if (!p.original_price || p.original_price <= p.price) return null;
        return Math.round((1 - p.price / p.original_price) * 100);
    };

    const stockBadge = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', cls: 'danger' };
        if (stock <= 5) return { label: `Low (${stock})`, cls: 'warning' };
        return { label: `${stock} in stock`, cls: 'success' };
    };

    const renderProducts = () => (
        <div style={{ display: 'flex', gap: '0', height: '100%', position: 'relative' }}>
            <div className="admin-table-container" style={{ flex: 1, minWidth: 0 }}>

                {/* ── Toolbar ── */}
                <div className="admin-table-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ margin: 0 }}>Product Inventory <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '14px' }}>({filteredProducts.length} of {products.length})</span></h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text" placeholder="Search products..."
                                value={productSearch} onChange={e => setProductSearch(e.target.value)}
                                style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '200px', fontSize: '13px' }}
                            />
                        </div>
                        {/* Category filter */}
                        <div style={{ position: 'relative' }}>
                            <select value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)}
                                style={{ appearance: 'none', paddingLeft: '12px', paddingRight: '28px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                        <button className="btn-primary" onClick={openAddPanel} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Plus size={16} /> Add Product
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Rating</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => {
                                const disc = discountPct(p);
                                const stock = stockBadge(p.stock);
                                return (
                                    <tr key={p.id}>
                                        <td>
                                            {p.image_url
                                                ? <img src={p.image_url} alt={p.name} className="table-img" style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '10px' }} />
                                                : <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageOff size={20} color="var(--text-muted)" /></div>
                                            }
                                        </td>
                                        <td>
                                            <div className="font-medium" style={{ fontSize: '14px' }}>{p.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>#{p.id}</div>
                                        </td>
                                        <td><span className="table-badge">{p.category}</span></td>
                                        <td>
                                            <div className="font-bold text-teal">${p.price.toFixed(2)}</div>
                                            {p.original_price && <div style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${p.original_price.toFixed(2)}</div>}
                                        </td>
                                        <td>
                                            {disc ? <span className="table-badge warning">-{disc}%</span> : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={13} fill="#D4AF37" color="#D4AF37" />
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.rating?.toFixed(1) ?? '0.0'}</span>
                                            </div>
                                        </td>
                                        <td><span className={`table-badge ${stock.cls}`}>{stock.label}</span></td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="icon-btn edit" title="Edit" onClick={() => openEditPanel(p)}><Edit size={15} /></button>
                                                <button className="icon-btn" title="View" style={{ color: 'var(--text-muted)' }} onClick={() => window.open(`/product/${p.id}`, '_blank')}><Eye size={15} /></button>
                                                <button className="icon-btn delete" title="Delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products match your search.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Slide-in Product Panel ── */}
            {productPanelOpen && (
                <>
                    <div className="product-panel-overlay" onClick={closeProductPanel} />
                    <div className="product-panel">
                        {/* Header */}
                        <div className="product-panel-header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>{productPanelMode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {productPanelMode === 'add' ? 'Fill in all required fields to create a product.' : `Editing: ${productForm.name}`}
                                </p>
                            </div>
                            <button onClick={closeProductPanel} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)' }}><X size={22} /></button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveProduct} className="product-panel-body">

                            {/* Image upload area */}
                            <div className="panel-section-label">Product Images</div>
                            <div
                                className={`product-drop-zone ${dragOver ? 'dragover' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {productFormFilePreviews.length > 0 ? (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {productFormFilePreviews.map((src, i) => (
                                            <img key={i} src={src} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--primary-teal)' }} />
                                        ))}
                                    </div>
                                ) : productForm.image_url ? (
                                    <img src={productForm.image_url} alt="Preview" style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <Upload size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Drop images here or click to upload</div>
                                        <div style={{ fontSize: '12px', marginTop: '4px' }}>PNG, JPG up to 5MB each</div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files)} />

                            <div className="panel-section-label" style={{ marginTop: '8px' }}>— or paste image URL —</div>
                            <input
                                type="url" placeholder="https://example.com/image.jpg"
                                value={productForm.image_url}
                                onChange={e => { setProductForm(f => ({ ...f, image_url: e.target.value })); setProductFormFiles([]); setProductFormFilePreviews([]); }}
                                className="panel-input"
                            />

                            {/* Name */}
                            <div className="panel-section-label">Product Name *</div>
                            <input required type="text" placeholder="e.g. Premium Oak Dining Table"
                                value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                                className="panel-input" />

                            {/* Category */}
                            <div className="panel-section-label">Category *</div>
                            <input required type="text" placeholder="e.g. Tables, Sofas, Chairs"
                                value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                                className="panel-input" list="existing-categories" />
                            <datalist id="existing-categories">
                                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
                            </datalist>

                            {/* Price row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <div className="panel-section-label">Sale Price * ($)</div>
                                    <input required type="number" step="0.01" min="0" placeholder="299.00"
                                        value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                                        className="panel-input" />
                                </div>
                                <div>
                                    <div className="panel-section-label">Original Price ($) <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></div>
                                    <input type="number" step="0.01" min="0" placeholder="399.00"
                                        value={productForm.original_price} onChange={e => setProductForm(f => ({ ...f, original_price: e.target.value }))}
                                        className="panel-input" />
                                </div>
                            </div>

                            {/* Discount preview */}
                            {productForm.price && productForm.original_price && parseFloat(productForm.original_price) > parseFloat(productForm.price) && (
                                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={15} />
                                    Discount: <strong>{Math.round((1 - parseFloat(productForm.price) / parseFloat(productForm.original_price)) * 100)}% off</strong>
                                    &nbsp;— saves ${(parseFloat(productForm.original_price) - parseFloat(productForm.price)).toFixed(2)}
                                </div>
                            )}

                            {/* Stock */}
                            <div className="panel-section-label">Stock Quantity *</div>
                            <input required type="number" min="0" placeholder="0"
                                value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))}
                                className="panel-input" />
                            {productForm.stock !== '' && parseInt(productForm.stock) === 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                    <AlertTriangle size={13} /> Product will be marked as Out of Stock
                                </div>
                            )}
                            {productForm.stock !== '' && parseInt(productForm.stock) > 0 && parseInt(productForm.stock) <= 5 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontSize: '12px', marginTop: '4px' }}>
                                    <AlertTriangle size={13} /> Low stock — consider restocking soon
                                </div>
                            )}

                            {/* Description */}
                            <div className="panel-section-label">Description <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></div>
                            <textarea rows={4} placeholder="Describe the product materials, dimensions, and features..."
                                value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                                className="panel-input" style={{ resize: 'vertical', fontFamily: 'inherit' }} />

                            {/* Save feedback */}
                            {productSaveMsg === 'success' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#16a34a', fontSize: '14px' }}>
                                    <CheckCircle size={16} /> Product saved successfully!
                                </div>
                            )}
                            {productSaveMsg?.startsWith('error:') && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '14px' }}>
                                    <AlertTriangle size={16} /> {productSaveMsg.replace('error:', '')}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="product-panel-footer">
                                <button type="button" className="btn-secondary" onClick={closeProductPanel} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={productSaving} style={{ flex: 2, opacity: productSaving ? 0.7 : 1 }}>
                                    {productSaving ? 'Saving...' : productPanelMode === 'add' ? '+ Create Product' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
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

    /* ── PROMOTIONS ── */
    const ICON_OPTIONS = ['Tag', 'Truck', 'Gift', 'BadgePercent', 'Zap', 'Clock', 'Sparkles', 'Star', 'Package'];

    const handleAddPromo = async (e) => {
        e.preventDefault();
        if (!newPromoText.trim()) return;
        try {
            const res = await axios.post('http://localhost:8000/api/promos/', {
                text: newPromoText.trim(),
                icon: newPromoIcon,
                is_active: true,
            });
            setPromos(prev => [...prev, res.data]);
            setNewPromoText('');
            setNewPromoIcon('Tag');
        } catch (err) { alert('Failed to add promo'); }
    };

    const handleTogglePromo = async (promo) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/promos/${promo.id}`, { is_active: !promo.is_active });
            setPromos(prev => prev.map(p => p.id === promo.id ? res.data : p));
        } catch { alert('Failed to update promo'); }
    };

    const handleDeletePromo = async (id) => {
        if (!window.confirm('Delete this promo?')) return;
        await axios.delete(`http://localhost:8000/api/promos/${id}`);
        setPromos(prev => prev.filter(p => p.id !== id));
    };

    const handleSavePromoEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/api/promos/${editingPromo.id}`, {
                text: editingPromo.text,
                icon: editingPromo.icon,
            });
            setPromos(prev => prev.map(p => p.id === editingPromo.id ? res.data : p));
            setEditingPromo(null);
        } catch { alert('Failed to save'); }
    };

    const renderPromos = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Manage Promo Banner</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Visible on the Shop page ticker</span>
            </div>

            {/* Add new */}
            <form onSubmit={handleAddPromo} style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '0 0 140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-muted)' }}>ICON</label>
                    <select value={newPromoIcon} onChange={e => setNewPromoIcon(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-muted)' }}>PROMO TEXT</label>
                    <input type="text" value={newPromoText} onChange={e => setNewPromoText(e.target.value)}
                        placeholder="e.g. Free Shipping on orders over $500"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', flexShrink: 0 }}>
                    <Plus size={16} /> Add Promo
                </button>
            </form>

            {/* Table */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th style={{ width: 100 }}>Icon</th>
                        <th>Text</th>
                        <th style={{ width: 100 }}>Status</th>
                        <th style={{ width: 100 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promos.map(p => (
                        <tr key={p.id}>
                            <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>#{p.id}</td>
                            <td><span className="table-badge">{p.icon}</span></td>
                            <td className="font-medium">{p.text}</td>
                            <td>
                                <button onClick={() => handleTogglePromo(p)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: p.is_active ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: 600, fontSize: '13px' }}>
                                    {p.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                    {p.is_active ? 'Active' : 'Hidden'}
                                </button>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button className="icon-btn edit" onClick={() => setEditingPromo({ ...p })}><Edit size={16} /></button>
                                    <button className="icon-btn delete" onClick={() => handleDeletePromo(p.id)}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {promos.length === 0 && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No promos yet. Add one above!</td></tr>
                    )}
                </tbody>
            </table>

            {/* Inline edit modal */}
            {editingPromo && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Edit Promo</h3>
                        <form onSubmit={handleSavePromoEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Icon</label>
                                <select value={editingPromo.icon} onChange={e => setEditingPromo({ ...editingPromo, icon: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Promo Text</label>
                                <input type="text" value={editingPromo.text} onChange={e => setEditingPromo({ ...editingPromo, text: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setEditingPromo(null)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
                    <button className={activeTab === 'promos' ? 'active' : ''} onClick={() => setActiveTab('promos')}>
                        <Megaphone size={20} /> Promotions
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
                        {activeTab === 'promos' && 'Promo Banner Management'}
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
                    {activeTab === 'promos' && renderPromos()}
                </div>
            </main>
        </div>
    );
};

export default Admin;
