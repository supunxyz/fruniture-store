import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Star, ArrowLeft, ShoppingCart, ShieldCheck, Truck, Send, Trash2, MessageSquare } from 'lucide-react';
import { formatPrice } from '../utils/currency';

/* ── Reusable star renderer ── */
const StarRow = ({ value, size = 18, interactive = false, onSet }) => {
    const [hovered, setHovered] = useState(0);
    const display = interactive ? (hovered || value) : value;

    return (
        <span style={{ display: 'inline-flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map(n => {
                const filled = display >= n;
                const half = !filled && display >= n - 0.5;
                return (
                    <span
                        key={n}
                        style={{ position: 'relative', cursor: interactive ? 'pointer' : 'default', display: 'inline-flex' }}
                        onMouseEnter={() => interactive && setHovered(n)}
                        onMouseLeave={() => interactive && setHovered(0)}
                        onClick={() => interactive && onSet && onSet(n)}
                    >
                        {/* background (empty) star */}
                        <Star size={size} fill="transparent" color="#d1d5db" strokeWidth={1.5} />
                        {/* overlay filled portion */}
                        <span style={{
                            position: 'absolute', top: 0, left: 0,
                            width: half ? '50%' : filled ? '100%' : '0%',
                            overflow: 'hidden', display: 'inline-flex'
                        }}>
                            <Star size={size} fill="#D4AF37" color="#D4AF37" strokeWidth={1.5} />
                        </span>
                    </span>
                );
            })}
        </span>
    );
};

/* ── Rating summary bar ── */
const RatingBar = ({ star, count, total }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <span style={{ width: '14px', textAlign: 'right', color: 'var(--text-muted)' }}>{star}</span>
            <Star size={12} fill="#D4AF37" color="#D4AF37" />
            <div style={{ flex: 1, background: '#E2E8F0', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, background: '#D4AF37', height: '100%', borderRadius: '99px', transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ width: '28px', color: 'var(--text-muted)' }}>{count}</span>
        </div>
    );
};

/* ── Single review card ── */
const ReviewCard = ({ review, currentUserId, onDelete }) => {
    const initials = review.user?.username?.slice(0, 2).toUpperCase() || '??';
    const date = new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-avatar">{initials}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span className="review-username">{review.user?.username || 'User'}</span>
                        <StarRow value={review.rating} size={14} />
                        <span className="review-date">{date}</span>
                    </div>
                </div>
                {currentUserId === review.user_id && (
                    <button className="review-delete-btn" onClick={() => onDelete(review.id)} title="Delete review">
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
            {review.comment && <p className="review-body">{review.comment}</p>}
        </div>
    );
};

/* ══════════════════════════════════════════ */
const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart } = useCart();
    const { user } = useAuth();

    /* Fetch product */
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
            .then(res => { setProduct(res.data); setActiveImage(res.data.image_url); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    /* Fetch reviews */
    const fetchReviews = () => {
        setReviewsLoading(true);
        axios.get(`http://127.0.0.1:8000/api/reviews/product/${id}`)
            .then(res => setReviews(res.data))
            .catch(() => { })
            .finally(() => setReviewsLoading(false));
    };
    useEffect(() => { fetchReviews(); }, [id]);

    /* Derived review stats */
    const totalReviews = reviews.length;
    const avgRating = totalReviews ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;
    const starCounts = [5, 4, 3, 2, 1].map(s => ({
        star: s,
        count: reviews.filter(r => Math.round(r.rating) === s).length
    }));
    const alreadyReviewed = user && reviews.some(r => r.user_id === user.id);

    /* Submit review */
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!myRating) { setSubmitError('Please select a star rating.'); return; }
        setSubmitting(true);
        setSubmitError('');
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/reviews/product/${id}?user_id=${user.id}`,
                { rating: myRating, comment: myComment.trim() || null }
            );
            setMyRating(0);
            setMyComment('');
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
            fetchReviews();
        } catch (err) {
            setSubmitError(err.response?.data?.detail || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    /* Delete review */
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Delete your review?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}?user_id=${user.id}`);
            fetchReviews();
        } catch { }
    };

    /* Add to cart with feedback */
    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) return <div style={{ padding: '120px 20px', textAlign: 'center', fontSize: '1.2rem' }}>Loading product details...</div>;
    if (!product) return <div style={{ padding: '120px 20px', textAlign: 'center' }}>Product not found. <Link to="/shop" style={{ color: 'var(--primary-teal)' }}>Back to Shop</Link></div>;

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '32px' }}>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Back to Shop
                </Link>

                {/* ── Product info grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }} className="product-detail-grid">

                    {/* Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={activeImage || 'https://placehold.co/600x500/f5f5f5/aaa?text=No+Image'} alt={product.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '16px', transition: 'all 0.3s ease' }} onError={e => { e.target.src = 'https://placehold.co/600x500/f5f5f5/aaa?text=No+Image'; }} />
                        </div>
                        {product.images && product.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                <div onClick={() => setActiveImage(product.image_url)}
                                    style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--bg-secondary)', cursor: 'pointer', border: activeImage === product.image_url ? '2px solid var(--primary-teal)' : '2px solid transparent', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={product.image_url} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                {product.images.map(img => (
                                    <div key={img.id} onClick={() => setActiveImage(img.image_url)}
                                        style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--bg-secondary)', cursor: 'pointer', border: activeImage === img.image_url ? '2px solid var(--primary-teal)' : '2px solid transparent', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={img.image_url} alt={`Gallery ${img.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <span className="tag" style={{ background: 'var(--primary-teal-light)', color: 'white' }}>{product.category}</span>
                            {totalReviews > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <StarRow value={avgRating} size={16} />
                                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{avgRating.toFixed(1)}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
                                </div>
                            )}
                        </div>

                        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>{formatPrice(product.price)}</span>
                            {product.original_price && (
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
                                    {formatPrice(product.original_price)}
                                </span>
                            )}
                            {product.original_price && (
                                <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '13px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
                                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '40px' }}>
                            {product.description || `Enhance your space with our premium ${product.name}. Designed with both comfort and aesthetics in mind.`}
                        </p>

                        <button
                            className="btn-primary"
                            onClick={handleAddToCart}
                            style={{ padding: '16px 32px', fontSize: '1.05rem', width: '100%', justifyContent: 'center', marginBottom: '32px', background: addedToCart ? '#16a34a' : undefined, transition: 'all 0.3s ease' }}
                        >
                            <ShoppingCart size={20} />
                            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                { icon: <Truck size={22} />, title: 'Free Shipping', sub: 'On orders over $500' },
                                { icon: <ShieldCheck size={22} />, title: '2 Year Warranty', sub: 'Guaranteed quality' },
                            ].map(({ icon, title, sub }) => (
                                <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                                    <div style={{ background: 'white', padding: '10px', borderRadius: '12px', color: 'var(--primary-teal)', flexShrink: 0 }}>{icon}</div>
                                    <div><h4 style={{ fontSize: '14px', marginBottom: '2px' }}>{title}</h4><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════ REVIEWS SECTION ════════════════════════════════ */}
                <div className="reviews-section">
                    <div className="reviews-section-title">
                        <MessageSquare size={22} />
                        Customer Reviews
                    </div>

                    {/* Summary bar */}
                    {totalReviews > 0 && (
                        <div className="reviews-summary">
                            <div className="reviews-avg-block">
                                <div className="reviews-big-score">{avgRating.toFixed(1)}</div>
                                <StarRow value={avgRating} size={22} />
                                <div className="reviews-total-label">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</div>
                            </div>
                            <div className="reviews-bars">
                                {starCounts.map(({ star, count }) => (
                                    <RatingBar key={star} star={star} count={count} total={totalReviews} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Write-a-review form */}
                    <div className="review-form-wrapper">
                        <h3 className="review-form-heading">
                            {alreadyReviewed ? '✓ You have reviewed this product' : 'Write a Review'}
                        </h3>

                        {!user ? (
                            <div className="review-login-prompt">
                                <p>Please <Link to="/login" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>sign in</Link> to leave a review.</p>
                            </div>
                        ) : alreadyReviewed ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>You've already submitted a review. Delete it below to write a new one.</p>
                        ) : (
                            <form onSubmit={handleSubmitReview} className="review-form">
                                <div className="review-star-select">
                                    <label>Your Rating <span style={{ color: '#ef4444' }}>*</span></label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <StarRow value={myRating} size={30} interactive onSet={setMyRating} />
                                        <span className="review-rating-label">
                                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][myRating] || ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="review-comment-group">
                                    <label>Comment <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                                    <textarea
                                        value={myComment}
                                        onChange={e => setMyComment(e.target.value)}
                                        placeholder="Share your thoughts about this product..."
                                        rows={4}
                                        maxLength={1000}
                                        className="review-textarea"
                                    />
                                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {myComment.length}/1000
                                    </div>
                                </div>

                                {submitError && <div className="review-error">{submitError}</div>}
                                {submitSuccess && <div className="review-success">✓ Review submitted successfully!</div>}

                                <button type="submit" className="btn-primary review-submit-btn" disabled={submitting}>
                                    <Send size={16} />
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* List of reviews */}
                    <div className="reviews-list">
                        {reviewsLoading ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                            <div className="reviews-empty">
                                <Star size={40} color="#d1d5db" />
                                <p>No reviews yet. Be the first to review this product!</p>
                            </div>
                        ) : (
                            reviews.map(r => (
                                <ReviewCard
                                    key={r.id}
                                    review={r}
                                    currentUserId={user?.id}
                                    onDelete={handleDeleteReview}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
