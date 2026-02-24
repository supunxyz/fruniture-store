import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Plus, Edit, Trash2, Star, Megaphone, ToggleLeft, ToggleRight, Search, X, Upload, Eye, AlertTriangle, CheckCircle, ChevronDown, ImageOff, MapPin, Phone, Package2, Clock, Truck, XCircle, BookOpen, FileText, Globe, EyeOff } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import '../admin.css';
import { formatPrice } from '../utils/currency';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [viewingOrder, setViewingOrder] = useState(null);  // order detail modal
    const [orderStatusUpdating, setOrderStatusUpdating] = useState(false);
    const [heroData, setHeroData] = useState(null);
    const [heroImageFile, setHeroImageFile] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState(null);
    const [heroImageUploading, setHeroImageUploading] = useState(false);
    const [heroDragOver, setHeroDragOver] = useState(false);
    const heroFileInputRef = useRef(null);

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
    // Blog state
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogPanelOpen, setBlogPanelOpen] = useState(false);
    const [blogPanelMode, setBlogPanelMode] = useState('add');
    const [blogSaving, setBlogSaving] = useState(false);
    const [blogDragOver, setBlogDragOver] = useState(false);
    const [blogImagePreview, setBlogImagePreview] = useState(null);
    const [blogImageFile, setBlogImageFile] = useState(null);
    const blogFileInputRef = useRef(null);
    const EMPTY_POST = { title: '', excerpt: '', content: '', image_url: '', category: '', author: 'Admin', is_published: true };
    const [blogForm, setBlogForm] = useState(EMPTY_POST);
    const BLOG_CATEGORIES = ['Design Tips', 'Buying Guide', 'Trends', 'Lifestyle', 'News'];


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [prodRes, userRes, orderRes, heroRes, promoRes, blogRes] = await Promise.allSettled([
            axios.get('http://localhost:8000/api/products'),
            axios.get('http://localhost:8000/api/users'),
            axios.get('http://localhost:8000/api/orders'),
            axios.get('http://localhost:8000/api/hero'),
            axios.get('http://localhost:8000/api/promos/all'),
            axios.get('http://localhost:8000/api/blog/'),
        ]);
        if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
        if (userRes.status === 'fulfilled') setUsers(userRes.value.data);
        if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data);
        if (heroRes.status === 'fulfilled') setHeroData(heroRes.value.data);
        if (promoRes.status === 'fulfilled') setPromos(promoRes.value.data);
        if (blogRes.status === 'fulfilled') setBlogPosts(blogRes.value.data);
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
        setProductForm({ ...product, original_price: product.original_price ?? '', description: product.description ?? '', images: product.images ?? [] });
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
            let saved;

            if (productPanelMode === 'add') {
                // ── CREATE ──────────────────────────────────────────────
                const createPayload = {
                    name: productForm.name,
                    price: parseFloat(productForm.price),
                    original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
                    category: productForm.category,
                    stock: parseInt(productForm.stock),
                    description: productForm.description || null,
                    // Send null if a file is being uploaded (backend accepts Optional[str])
                    image_url: productFormFiles.length > 0 ? null : (productForm.image_url || null),
                    rating: 0.0,
                };
                const res = await axios.post('http://localhost:8000/api/products', createPayload);
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
                // ── EDIT ─────────────────────────────────────────────────
                // Step 1: If new local files were selected, upload them first
                // to get the real stored URL before saving other fields.
                let resolvedImageUrl = productForm.image_url; // keep existing URL by default
                if (productFormFiles.length > 0) {
                    const fd = new FormData();
                    productFormFiles.forEach(f => fd.append('files', f));
                    const imgRes = await axios.post(
                        `http://localhost:8000/api/products/${productForm.id}/images`,
                        fd,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                    resolvedImageUrl = imgRes.data.image_url; // real URL from backend
                }

                // Step 2: Save all field changes with the resolved image URL
                const editPayload = {
                    name: productForm.name,
                    price: parseFloat(productForm.price),
                    original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
                    category: productForm.category,
                    stock: parseInt(productForm.stock),
                    description: productForm.description || null,
                    image_url: resolvedImageUrl,
                    rating: productForm.rating ?? 0.0,
                };
                const res = await axios.put(`http://localhost:8000/api/products/${productForm.id}`, editPayload);
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
        setHeroImageUploading(true);
        try {
            let updatedHero = heroData;

            // If a local file was selected, upload it first
            if (heroImageFile) {
                const fd = new FormData();
                fd.append('file', heroImageFile);
                const imgRes = await axios.post(
                    `http://localhost:8000/api/hero/${heroData.id}/image`,
                    fd,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                updatedHero = { ...heroData, image_url: imgRes.data.image_url };
                setHeroData(updatedHero);
                setHeroImageFile(null);
                setHeroImagePreview(null);
            }

            const res = await axios.put(`http://localhost:8000/api/hero/${updatedHero.id}`, updatedHero);
            setHeroData(res.data);
            alert('Hero settings updated successfully!');
        } catch (error) {
            console.error('Failed to update hero', error);
            alert('Error updating hero settings.');
        } finally {
            setHeroImageUploading(false);
        }
    };

    const handleHeroFileChange = (files) => {
        const file = files[0];
        if (!file) return;
        setHeroImageFile(file);
        setHeroImagePreview(URL.createObjectURL(file));
        // Clear the URL field since a file takes priority
        setHeroData(h => ({ ...h, image_url: '' }));
    };

    const handleHeroImageDrop = (e) => {
        e.preventDefault();
        setHeroDragOver(false);
        handleHeroFileChange(e.dataTransfer.files);
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
                                            {p.image_url && p.image_url !== 'pending'
                                                ? <img src={p.image_url} alt={p.name} className="table-img" style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '10px' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                : <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageOff size={20} color="var(--text-muted)" /></div>
                                            }
                                        </td>
                                        <td>
                                            <div className="font-medium" style={{ fontSize: '14px' }}>{p.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>#{p.id}</div>
                                        </td>
                                        <td><span className="table-badge">{p.category}</span></td>
                                        <td>
                                            <div className="font-bold text-teal">{formatPrice(p.price)}</div>
                                            {p.original_price && <div style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatPrice(p.original_price)}</div>}
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

                        {/* Form body — scrollable fields only */}
                        <form id="product-panel-form" onSubmit={handleSaveProduct} className="product-panel-body">

                            {/* ── Gallery Manager ── */}
                            <div className="panel-section-label">Product Images</div>

                            {/* Existing saved images (edit mode) */}
                            {productPanelMode === 'edit' && productForm.images && productForm.images.length > 0 && (
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Saved images — click <strong>Set Primary</strong> to change main image, <strong>✕</strong> to delete</div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {productForm.images.map(img => (
                                            <div key={img.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img
                                                        src={img.image_url}
                                                        alt=""
                                                        style={{
                                                            width: '84px', height: '84px', objectFit: 'cover', borderRadius: '8px',
                                                            border: productForm.image_url === img.image_url
                                                                ? '3px solid var(--primary-teal)'
                                                                : '2px solid var(--border-color)'
                                                        }}
                                                    />
                                                    {/* Primary badge */}
                                                    {productForm.image_url === img.image_url && (
                                                        <div style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--primary-teal)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', letterSpacing: '0.5px' }}>PRIMARY</div>
                                                    )}
                                                    {/* Delete button */}
                                                    <button type="button" title="Remove image"
                                                        onClick={async () => {
                                                            if (!window.confirm('Remove this image?')) return;
                                                            try {
                                                                const r = await axios.delete(`http://localhost:8000/api/products/${productForm.id}/images/${img.id}`);
                                                                setProductForm(f => ({ ...f, image_url: r.data.image_url, images: r.data.images }));
                                                                setProducts(prev => prev.map(p => p.id === r.data.id ? r.data : p));
                                                            } catch { alert('Failed to remove image.'); }
                                                        }}
                                                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(220,38,38,0.87)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', color: 'white', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                                                    >×</button>
                                                </div>
                                                {/* Set Primary button — only shown when not already primary */}
                                                {productForm.image_url !== img.image_url && (
                                                    <button type="button"
                                                        onClick={async () => {
                                                            try {
                                                                const r = await axios.put(`http://localhost:8000/api/products/${productForm.id}/images/${img.id}/set-primary`);
                                                                setProductForm(f => ({ ...f, image_url: img.image_url, images: r.data.images }));
                                                                setProducts(prev => prev.map(p => p.id === r.data.id ? r.data : p));
                                                            } catch { alert('Failed to set primary image.'); }
                                                        }}
                                                        style={{ fontSize: '10px', fontWeight: 600, color: 'var(--primary-teal)', background: 'var(--bg-secondary)', border: '1px solid var(--primary-teal)', borderRadius: '6px', padding: '2px 6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                    >Set Primary</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New files queued for upload */}
                            {productFormFilePreviews.length > 0 && (
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--primary-teal)', marginBottom: '6px', fontWeight: 600 }}>📎 {productFormFilePreviews.length} new file(s) ready to upload</div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {productFormFilePreviews.map((src, i) => (
                                            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                                <img src={src} alt="" style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '8px', border: '2px dashed var(--primary-teal)', opacity: 0.85 }} />
                                                <button type="button" title="Remove from queue"
                                                    onClick={() => {
                                                        const newFiles = productFormFiles.filter((_, fi) => fi !== i);
                                                        const newPreviews = productFormFilePreviews.filter((_, pi) => pi !== i);
                                                        setProductFormFiles(newFiles);
                                                        setProductFormFilePreviews(newPreviews);
                                                    }}
                                                    style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', color: 'white', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                                                >×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Drop zone to add more images */}
                            <div
                                className={`product-drop-zone ${dragOver ? 'dragover' : ''}`}
                                style={{ minHeight: '80px', padding: '16px' }}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); const newFiles = [...productFormFiles, ...Array.from(e.dataTransfer.files)]; setProductFormFiles(newFiles); setProductFormFilePreviews(newFiles.map(f => URL.createObjectURL(f))); setProductForm(f => ({ ...f, image_url: '' })); }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Upload size={24} style={{ margin: '0 auto 6px', display: 'block', opacity: 0.4 }} />
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>Drop images or click to add more</div>
                                    <div style={{ fontSize: '11px', marginTop: '2px' }}>PNG, JPG, WEBP · multiple allowed</div>
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
                                onChange={e => {
                                    const newFiles = [...productFormFiles, ...Array.from(e.target.files)];
                                    setProductFormFiles(newFiles);
                                    setProductFormFilePreviews(newFiles.map(f => URL.createObjectURL(f)));
                                    setProductForm(f => ({ ...f, image_url: '' }));
                                    e.target.value = '';
                                }}
                            />

                            <div className="panel-section-label" style={{ marginTop: '4px' }}>— or paste image URL —</div>
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
                                    <div className="panel-section-label">Sale Price * (Rs.)</div>
                                    <input required type="number" step="0.01" min="0" placeholder="299.00"
                                        value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                                        className="panel-input" />
                                </div>
                                <div>
                                    <div className="panel-section-label">Original Price (Rs.) <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></div>
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
                                    &nbsp;— saves {formatPrice(parseFloat(productForm.original_price) - parseFloat(productForm.price))}
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
                            <textarea
                                rows={5}
                                placeholder="Describe the product materials, dimensions, and features..."
                                value={productForm.description}
                                onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                                className="panel-input panel-textarea"
                            />

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

                        </form>

                        {/* Footer — outside the scroll area so it never overlaps content */}
                        <div className="product-panel-footer">
                            <Button variant="secondary" type="button" onClick={closeProductPanel} style={{ flex: 1 }}>Cancel</Button>
                            <Button variant="primary" type="submit" form="product-panel-form" loading={productSaving} style={{ flex: 2 }}>
                                {productPanelMode === 'add' ? '+ Create Product' : 'Save Changes'}
                            </Button>
                        </div>
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

    const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const statusStyle = (status) => {
        const map = {
            pending: { cls: 'warning', icon: <Clock size={12} /> },
            processing: { cls: 'warning', icon: <Package2 size={12} /> },
            shipped: { cls: '', icon: <Truck size={12} /> },
            delivered: { cls: 'success', icon: <CheckCircle size={12} /> },
            cancelled: { cls: 'danger', icon: <XCircle size={12} /> },
        };
        return map[status] || { cls: '', icon: null };
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        setOrderStatusUpdating(true);
        try {
            const res = await axios.put(`http://localhost:8000/api/orders/${orderId}`, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
            if (viewingOrder?.id === orderId) setViewingOrder(res.data);
        } catch (err) {
            alert('Failed to update order status.');
        } finally {
            setOrderStatusUpdating(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Delete this order permanently?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o.id !== orderId));
            setStats(s => ({ ...s, orders: s.orders - 1 }));
            if (viewingOrder?.id === orderId) setViewingOrder(null);
        } catch (err) {
            alert('Failed to delete order.');
        }
    };

    const renderOrders = () => (
        <div style={{ position: 'relative' }}>
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>Order Tracking <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '14px' }}>({orders.length} total)</span></h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => {
                                const { cls, icon } = statusStyle(o.status);
                                return (
                                    <tr key={o.id}>
                                        <td><span style={{ fontWeight: 700 }}>#{o.id}</span></td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>User #{o.user_id}</div>
                                            {o.mobile1 && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.mobile1}</div>}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td><span className="font-bold text-teal">{formatPrice(o.total_amount)}</span></td>
                                        <td>
                                            <span className={`table-badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                {icon}{o.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="icon-btn edit" title="View details" onClick={() => setViewingOrder(o)}><Eye size={15} /></button>
                                                <button className="icon-btn delete" title="Delete order" onClick={() => handleDeleteOrder(o.id)}><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders have been placed yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Order Detail Modal ── */}
            {viewingOrder && (
                <>
                    <div className="product-panel-overlay" onClick={() => setViewingOrder(null)} />
                    <div className="product-panel" style={{ width: '480px' }}>
                        <div className="product-panel-header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>Order #{viewingOrder.id}</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {new Date(viewingOrder.created_at).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setViewingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)' }}><X size={22} /></button>
                        </div>

                        <div className="product-panel-body">

                            {/* Status changer */}
                            <div className="panel-section-label">Order Status</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                {ORDER_STATUSES.map(s => {
                                    const active = viewingOrder.status === s;
                                    const { cls } = statusStyle(s);
                                    return (
                                        <button
                                            key={s}
                                            disabled={orderStatusUpdating}
                                            onClick={() => handleUpdateOrderStatus(viewingOrder.id, s)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                                                fontWeight: 600, cursor: 'pointer', border: '2px solid',
                                                transition: 'all 0.2s',
                                                borderColor: active ? 'var(--primary-teal)' : 'var(--border-color)',
                                                background: active ? 'var(--primary-teal)' : 'transparent',
                                                color: active ? 'white' : 'var(--text-muted)',
                                                opacity: orderStatusUpdating ? 0.6 : 1,
                                            }}
                                        >
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Customer info */}
                            <div className="panel-section-label" style={{ marginTop: '16px' }}>Customer</div>
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '14px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={15} color="var(--text-muted)" />
                                    <span>User #{viewingOrder.user_id}</span>
                                </div>
                                {viewingOrder.mobile1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Phone size={15} color="var(--text-muted)" />
                                        <span>{viewingOrder.mobile1}{viewingOrder.mobile2 ? ` / ${viewingOrder.mobile2}` : ''}</span>
                                    </div>
                                )}
                                {viewingOrder.address && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <MapPin size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span style={{ lineHeight: 1.5 }}>{viewingOrder.address}</span>
                                    </div>
                                )}
                                {viewingOrder.payment_method && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={15} color="var(--text-muted)" />
                                        <span>Payment: <strong>{viewingOrder.payment_method}</strong></span>
                                    </div>
                                )}
                            </div>

                            {/* Order items */}
                            <div className="panel-section-label" style={{ marginTop: '16px' }}>Items ({viewingOrder.items.length})</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {viewingOrder.items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '10px 12px' }}>
                                        {item.product_image && item.product_image !== 'pending'
                                            ? <img src={item.product_image} alt={item.product_name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                                            : <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Package size={20} color="var(--text-muted)" /></div>
                                        }
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.product_name || `Product #${item.product_id}`}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--primary-teal)', flexShrink: 0 }}>
                                            {formatPrice(item.quantity * item.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-secondary)', borderRadius: '10px', marginTop: '12px' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>Order Total</span>
                                <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--primary-teal)' }}>{formatPrice(viewingOrder.total_amount)}</span>
                            </div>
                        </div>

                        <div className="product-panel-footer">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => setViewingOrder(null)}
                                style={{ flex: 1 }}
                            >
                                Close
                            </Button>
                            <Button
                                variant="danger"
                                type="button"
                                icon={<Trash2 size={15} />}
                                onClick={() => handleDeleteOrder(viewingOrder.id)}
                                style={{ flex: 1 }}
                            >
                                Delete Order
                            </Button>
                        </div>
                    </div>
                </>
            )}
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
                <Button type="submit" icon={<Plus size={16} />} size="sm" style={{ flexShrink: 0 }}>
                    Add Promo
                </Button>
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
                                <Button variant="secondary" type="button" onClick={() => setEditingPromo(null)}>Cancel</Button>
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    // ─── BLOG HANDLERS ──────────────────────────────────────────────────────
    const closeBlogPanel = () => { setBlogPanelOpen(false); setBlogImagePreview(null); setBlogImageFile(null); };

    const handleBlogFileChange = (files) => {
        const file = files[0];
        if (!file) return;
        setBlogImageFile(file);
        setBlogImagePreview(URL.createObjectURL(file));
        setBlogForm(f => ({ ...f, image_url: '' }));
    };

    const handleSaveBlogPost = async (e) => {
        e.preventDefault();
        setBlogSaving(true);
        try {
            const editId = blogForm._id;
            const payload = { title: blogForm.title, excerpt: blogForm.excerpt, content: blogForm.content, image_url: blogForm.image_url || null, category: blogForm.category, author: blogForm.author, is_published: blogForm.is_published };
            let savedPost;
            if (blogPanelMode === 'add') {
                const res = await axios.post('http://localhost:8000/api/blog/', payload);
                savedPost = res.data;
                setBlogPosts(prev => [savedPost, ...prev]);
            } else {
                const res = await axios.put(`http://localhost:8000/api/blog/${editId}`, payload);
                savedPost = res.data;
                setBlogPosts(prev => prev.map(p => p.id === editId ? savedPost : p));
            }
            if (blogImageFile && savedPost?.id) {
                const fd = new FormData();
                fd.append('file', blogImageFile);
                const imgRes = await axios.post(`http://localhost:8000/api/blog/${savedPost.id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setBlogPosts(prev => prev.map(p => p.id === savedPost.id ? imgRes.data : p));
            }
            closeBlogPanel();
        } catch (err) {
            alert('Failed to save post: ' + (err.response?.data?.detail || err.message));
        } finally {
            setBlogSaving(false);
        }
    };

    const handleDeleteBlogPost = async (id) => {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/blog/${id}`);
            setBlogPosts(prev => prev.filter(p => p.id !== id));
        } catch { alert('Failed to delete post.'); }
    };

    const handleToggleBlogPublish = async (post) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/blog/${post.id}`, { is_published: !post.is_published });
            setBlogPosts(prev => prev.map(p => p.id === post.id ? res.data : p));
        } catch { alert('Failed to update.'); }
    };

    const renderBlog = () => (
        <div style={{ position: 'relative' }}>
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>Blog Posts <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '14px' }}>({blogPosts.length} total)</span></h3>
                    <Button icon={<Plus size={16} />} onClick={() => { setBlogForm(EMPTY_POST); setBlogPanelMode('add'); setBlogImagePreview(null); setBlogImageFile(null); setBlogPanelOpen(true); }}>New Post</Button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogPosts.map(post => (
                            <tr key={post.id}>
                                <td>
                                    {post.image_url
                                        ? <img src={post.image_url} alt={post.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                                        : <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color="var(--text-muted)" /></div>
                                    }
                                </td>
                                <td style={{ maxWidth: '260px' }}>
                                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</div>
                                    {post.excerpt && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.excerpt}</div>}
                                </td>
                                <td>{post.category ? <span className="table-badge">{post.category}</span> : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>}</td>
                                <td>
                                    <button onClick={() => handleToggleBlogPublish(post)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: post.is_published ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: 600, fontSize: '13px' }}>
                                        {post.is_published ? <><Globe size={15} /> Published</> : <><EyeOff size={15} /> Draft</>}
                                    </button>
                                </td>
                                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {new Date(post.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="icon-btn edit" title="Edit" onClick={() => { setBlogForm({ ...post, _id: post.id }); setBlogPanelMode('edit'); setBlogImagePreview(post.image_url || null); setBlogImageFile(null); setBlogPanelOpen(true); }}><Edit size={15} /></button>
                                        <button className="icon-btn delete" title="Delete" onClick={() => handleDeleteBlogPost(post.id)}><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {blogPosts.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No blog posts yet. Click "New Post" to get started!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Blog slide-in editor panel */}
            {blogPanelOpen && (
                <>
                    <div className="product-panel-overlay" onClick={closeBlogPanel} />
                    <div className="product-panel" style={{ width: '560px' }}>
                        <div className="product-panel-header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>{blogPanelMode === 'add' ? 'New Blog Post' : 'Edit Post'}</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Fill in the details below</p>
                            </div>
                            <button onClick={closeBlogPanel} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)' }}><X size={22} /></button>
                        </div>

                        <div className="product-panel-body">
                            <form id="blog-panel-form" onSubmit={handleSaveBlogPost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* Cover image */}
                                <div>
                                    <div className="panel-section-label">Cover Image</div>
                                    <div
                                        className={`product-drop-zone${blogDragOver ? ' dragover' : ''}`}
                                        style={{ cursor: 'pointer', marginBottom: '8px' }}
                                        onClick={() => blogFileInputRef.current?.click()}
                                        onDragOver={e => { e.preventDefault(); setBlogDragOver(true); }}
                                        onDragLeave={() => setBlogDragOver(false)}
                                        onDrop={e => { e.preventDefault(); setBlogDragOver(false); handleBlogFileChange(e.dataTransfer.files); }}
                                    >
                                        {blogImagePreview ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                <img src={blogImagePreview} alt="Preview" style={{ maxHeight: '130px', maxWidth: '100%', borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--primary-teal)' }} onError={e => e.target.style.display = 'none'} />
                                                <span style={{ fontSize: '12px', color: 'var(--primary-teal)', fontWeight: 600 }}>Click to change image</span>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                                <Upload size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                                                <div style={{ fontSize: '13px', fontWeight: 500 }}>Drop image or click to upload</div>
                                                <div style={{ fontSize: '12px', marginTop: '4px' }}>PNG, JPG, WEBP</div>
                                            </div>
                                        )}
                                    </div>
                                    <input ref={blogFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleBlogFileChange(e.target.files)} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>— or paste URL —</span>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                                    </div>
                                    <input type="url" placeholder="https://..." value={blogForm.image_url} onChange={e => { setBlogForm(f => ({ ...f, image_url: e.target.value })); setBlogImageFile(null); setBlogImagePreview(e.target.value || null); }} className="panel-input" />
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="panel-label">Title *</label>
                                    <input type="text" required value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} className="panel-input" placeholder="Post title" />
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="panel-label">Excerpt</label>
                                    <textarea value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} className="panel-input" rows={3} placeholder="Short summary shown on the blog listing…" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="panel-label">Full Content</label>
                                    <textarea value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} className="panel-input" rows={8} placeholder="Write the full article here…" style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '13px', lineHeight: 1.7 }} />
                                </div>

                                {/* Category + Author */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="panel-label">Category</label>
                                        <select value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))} className="panel-input">
                                            <option value="">Select…</option>
                                            {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="panel-label">Author</label>
                                        <input type="text" value={blogForm.author} onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))} className="panel-input" placeholder="Admin" />
                                    </div>
                                </div>

                                {/* Published toggle */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                                    <button type="button" onClick={() => setBlogForm(f => ({ ...f, is_published: !f.is_published }))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: blogForm.is_published ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: 600, fontSize: '14px', padding: 0 }}>
                                        {blogForm.is_published ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                        {blogForm.is_published ? 'Published — visible on the blog' : 'Draft — hidden from visitors'}
                                    </button>
                                </div>

                            </form>
                        </div>

                        <div className="product-panel-footer">
                            <Button variant="secondary" type="button" onClick={closeBlogPanel} style={{ flex: 1 }}>Cancel</Button>
                            <Button variant="primary" type="submit" form="blog-panel-form" loading={blogSaving} style={{ flex: 2 }}>
                                {blogPanelMode === 'add' ? '+ Publish Post' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderHeroSettings = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Hero Section Settings</h3>
            </div>
            {heroData ? (
                <form onSubmit={handleUpdateHero} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>

                    {/* Title row */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Title (First Line)</label>
                            <input type="text" value={heroData.title_black} onChange={e => setHeroData({ ...heroData, title_black: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: 'var(--primary-teal)' }}>Title (Highlighted)</label>
                            <input type="text" value={heroData.title_colored} onChange={e => setHeroData({ ...heroData, title_colored: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Title (End Line)</label>
                            <input type="text" value={heroData.title_black_2} onChange={e => setHeroData({ ...heroData, title_black_2: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Subtitle</label>
                        <textarea value={heroData.subtitle} onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }} />
                    </div>

                    {/* Prices */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Current Price (Rs.)</label>
                            <input type="number" step="0.01" value={heroData.current_price} onChange={e => setHeroData({ ...heroData, current_price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Old Price (Rs.)</label>
                            <input type="number" step="0.01" value={heroData.old_price} onChange={e => setHeroData({ ...heroData, old_price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Rating</label>
                            <input type="number" step="0.1" min="0" max="5" value={heroData.rating} onChange={e => setHeroData({ ...heroData, rating: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Reviews Count</label>
                            <input type="number" value={heroData.reviews_count} onChange={e => setHeroData({ ...heroData, reviews_count: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                    </div>

                    {/* ── Image section ── */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>Hero Image</label>

                        {/* Drag-and-drop zone */}
                        <div
                            className={`product-drop-zone${heroDragOver ? ' dragover' : ''}`}
                            style={{ marginBottom: '14px', cursor: 'pointer' }}
                            onDragOver={e => { e.preventDefault(); setHeroDragOver(true); }}
                            onDragLeave={() => setHeroDragOver(false)}
                            onDrop={handleHeroImageDrop}
                            onClick={() => heroFileInputRef.current?.click()}
                        >
                            {heroImagePreview ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <img src={heroImagePreview} alt="New hero preview" style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '10px', objectFit: 'contain', border: '2px solid var(--primary-teal)' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--primary-teal)', fontWeight: 600 }}>✓ New image ready — click Save Changes to apply</span>
                                </div>
                            ) : heroData.image_url ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <img src={heroData.image_url} alt="Current hero" style={{ maxHeight: '120px', maxWidth: '100%', borderRadius: '10px', objectFit: 'contain', opacity: 0.85 }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current image — drop or click to replace</span>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Upload size={32} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.45 }} />
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>Drop image here or click to upload</div>
                                    <div style={{ fontSize: '12px', marginTop: '4px' }}>PNG, JPG, WEBP up to 10 MB</div>
                                </div>
                            )}
                        </div>
                        <input
                            ref={heroFileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => handleHeroFileChange(e.target.files)}
                        />

                        {/* Clear selected file */}
                        {heroImageFile && (
                            <button
                                type="button"
                                onClick={() => { setHeroImageFile(null); setHeroImagePreview(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#dc2626', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <X size={13} /> Remove selected file
                            </button>
                        )}

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '2px 0 10px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>— or paste image URL —</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                        </div>

                        {/* URL input fallback */}
                        <input
                            type="url"
                            placeholder="https://example.com/hero-image.png"
                            value={heroData.image_url}
                            onChange={e => {
                                setHeroData(h => ({ ...h, image_url: e.target.value }));
                                setHeroImageFile(null);
                                setHeroImagePreview(null);
                            }}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px' }}
                        />
                    </div>

                    {/* Save button */}
                    <div style={{ marginTop: '4px' }}>
                        <Button type="submit" loading={heroImageUploading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                <p style={{ color: 'var(--text-muted)' }}>Loading settings...</p>
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
                    <button className={activeTab === 'blog' ? 'active' : ''} onClick={() => setActiveTab('blog')}>
                        <BookOpen size={20} /> Blog Posts
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
                        {activeTab === 'blog' && 'Blog Management'}
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
                    {activeTab === 'blog' && renderBlog()}
                </div>
            </main>
        </div>
    );
};

export default Admin;
