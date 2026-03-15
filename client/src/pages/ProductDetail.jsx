// Product Detail Page — Toast, Hover Zoom, Social Share, Reviews, Tabs, Wishlist, Size Guide, Badges, Delivery, Buy Now, Breadcrumbs, See More
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductCard from "../components/ProductCard";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import API from "../api/axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setSelectedSize(null);
        setQuantity(1);
        setActiveTab("description");
        setShowFullDesc(false);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.product);
        const firstAvailable = res.data.product.sizes?.find((s) => s.stock > 0);
        if (firstAvailable) setSelectedSize(firstAvailable.size);
        const allRes = await API.get("/products");
        const related = allRes.data.products.filter((p) => p.category === res.data.product.category && p._id !== res.data.product._id).slice(0, 3);
        setRelatedProducts(related);
      } catch (error) { console.error("Fetch Product Error:", error); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => { if (id) { const wishlist = JSON.parse(localStorage.getItem("nbl-wishlist") || "[]"); setWishlisted(wishlist.includes(id)); } }, [id]);
  useEffect(() => { if (id) { const allReviews = JSON.parse(localStorage.getItem("nbl-reviews") || "{}"); setReviews(allReviews[id] || []); } }, [id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("nbl-wishlist") || "[]");
    if (wishlisted) {
      localStorage.setItem("nbl-wishlist", JSON.stringify(wishlist.filter((wId) => wId !== id)));
      setWishlisted(false);
      showToast("Removed from wishlist", "info");
    } else {
      wishlist.push(id);
      localStorage.setItem("nbl-wishlist", JSON.stringify(wishlist));
      setWishlisted(true);
      showToast("Added to wishlist", "success");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.text.trim()) return;
    const newReview = { id: Date.now(), name: user?.name || "Anonymous", rating: reviewForm.rating, text: reviewForm.text, date: new Date().toLocaleDateString() };
    const allReviews = JSON.parse(localStorage.getItem("nbl-reviews") || "{}");
    if (!allReviews[id]) allReviews[id] = [];
    allReviews[id].unshift(newReview);
    localStorage.setItem("nbl-reviews", JSON.stringify(allReviews));
    setReviews(allReviews[id]);
    setReviewForm({ rating: 5, text: "" });
    setShowReviewForm(false);
    showToast("Review submitted!", "success");
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.title} at NBL Stores — Rs. ${product.price}`;
    switch (platform) {
      case "whatsapp": window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank"); break;
      case "facebook": window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"); break;
      case "twitter": window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank"); break;
      case "copy": navigator.clipboard.writeText(url); showToast("Link copied to clipboard!", "success"); break;
      default: break;
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const renderStars = (rating, interactive = false, onChange = null) => (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? "star-filled" : "star-empty"} ${interactive ? "star-interactive" : ""}`} onClick={() => interactive && onChange && onChange(star)}>★</span>
      ))}
    </div>
  );

  if (loading) return (<div className={`detail-page ${darkMode ? "detail-dark" : ""}`}><ProductsNavbar /><p className="loading-text font-[Inter]">Loading product...</p></div>);
  if (!product) return (<div className={`detail-page ${darkMode ? "detail-dark" : ""}`}><ProductsNavbar /><div className="not-found"><h1 className="font-[Playfair_Display]">Product Not Found</h1><Link to="/products" className="back-link font-[Inter]">← Back to Products</Link></div></div>);

  const selectedSizeObj = product.sizes?.find((s) => s.size === selectedSize);
  const currentStock = selectedSizeObj?.stock || 0;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;
  const isNewArrival = (new Date() - new Date(product.createdAt)) < 7 * 24 * 60 * 60 * 1000;
  const isBestSeller = product.totalStock <= 10 && product.totalStock > 0;

  const handleAddToCart = () => {
    if (!selectedSize) { showToast("Please select a size", "warning"); return; }
    if (isOutOfStock) { showToast("This size is out of stock", "error"); return; }
    if (quantity > currentStock) { showToast(`Only ${currentStock} available in size ${selectedSize}`, "warning"); return; }
    addToCart(product, selectedSize, quantity);
    showToast(`${product.title} (${selectedSize}) added to cart!`, "cart");
  };

  const handleBuyNow = () => {
    if (!selectedSize) { showToast("Please select a size", "warning"); return; }
    if (isOutOfStock) { showToast("This size is out of stock", "error"); return; }
    navigate("/checkout", { state: { buyNow: true, item: { _id: product._id, title: product.title, image: product.image, price: product.price, size: selectedSize, quantity } } });
  };

  const increaseQty = () => { if (quantity < currentStock) setQuantity((p) => p + 1); };
  const decreaseQty = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  return (
    <div className={`detail-page ${darkMode ? "detail-dark" : ""}`}>
      <SEO title={product?.title} description={product?.description} />
      <ProductsNavbar />

      <div className="detail-content">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/" className="breadcrumb-link font-[Inter]">Home</Link><span className="breadcrumb-sep">/</span>
          <Link to="/products" className="breadcrumb-link font-[Inter]">Products</Link><span className="breadcrumb-sep">/</span>
          <Link to="/products" className="breadcrumb-link font-[Inter]">{product.category}</Link><span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current font-[Inter]">{product.title}</span>
        </nav>

        <div className="detail-grid">
          {/* Left — Image with Hover Zoom */}
          <div
            className="detail-image-container"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--zoom-x", `${x}%`);
              e.currentTarget.style.setProperty("--zoom-y", `${y}%`);
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add("zooming")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("zooming")}
          >
            {/* Badges */}
            <div className="badge-container">
              {isNewArrival && <span className="product-badge badge-new font-[Inter]">New Arrival</span>}
              {isBestSeller && <span className="product-badge badge-best font-[Inter]">Best Seller</span>}
              {isLowStock && selectedSize && <span className="product-badge badge-low font-[Inter]">Low Stock</span>}
            </div>

            {/* Wishlist */}
            <button onClick={toggleWishlist} className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={wishlisted ? "#ef4444" : "none"} stroke={wishlisted ? "#ef4444" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            <img src={product.image} alt={product.title} className="detail-image" />
          </div>

          {/* Right — Info */}
          <div className="detail-info">
            <p className="detail-category font-[Inter]">{product.category}</p>
            <h1 className="detail-title font-[Playfair_Display]">{product.title}</h1>

            {reviews.length > 0 && (
              <div className="rating-summary">
                {renderStars(Math.round(avgRating))}
                <span className="rating-number font-[Inter]">{avgRating}</span>
                <span className="rating-count font-[Inter]">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </div>
            )}

            {product.sku && <p className="detail-sku font-[Inter]">SKU: {product.sku}</p>}
            <p className="detail-price font-[Inter]">Rs. {product.price}</p>

            {/* Description with See More */}
            <div className="detail-desc-container">
              <p className={`detail-desc font-[Inter] ${!showFullDesc ? "desc-truncated" : ""}`}>{product.description}</p>
              {product.description.length > 120 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="see-more-btn font-[Inter]">
                  {showFullDesc ? "See Less" : "See More"}
                </button>
              )}
            </div>

            {/* Size Selection */}
            <div className="size-section">
              <div className="size-header">
                <p className="size-label font-[Inter]">Select Size</p>
                <button onClick={() => setShowSizeGuide(true)} className="size-guide-link font-[Inter]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
                  Size Guide
                </button>
              </div>
              <div className="size-options">
                {(product.sizes || []).map((sizeObj) => (
                  <button key={sizeObj.size} onClick={() => { setSelectedSize(sizeObj.size); setQuantity(1); }} className={`size-btn font-[Inter] ${selectedSize === sizeObj.size ? "active-size" : ""} ${sizeObj.stock === 0 ? "size-disabled" : ""}`} disabled={sizeObj.stock === 0}>
                    {sizeObj.size}
                    {sizeObj.stock === 0 && <span className="size-cross">✕</span>}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <div className="stock-warning-container">
                  {isOutOfStock && <p className="stock-warning out-of-stock font-[Inter]">✕ Out of Stock</p>}
                  {isLowStock && <p className="stock-warning low-stock font-[Inter]">⚠ Only {currentStock} left in size {selectedSize} — Hurry up!</p>}
                  {!isOutOfStock && !isLowStock && <p className="stock-warning in-stock font-[Inter]">✓ In Stock</p>}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <p className="quantity-label font-[Inter]">Quantity</p>
              <div className="quantity-controls">
                <button onClick={decreaseQty} className="qty-btn font-[Inter]" disabled={isOutOfStock}>−</button>
                <span className="qty-value font-[Inter]">{quantity}</span>
                <button onClick={increaseQty} className="qty-btn font-[Inter]" disabled={isOutOfStock || quantity >= currentStock}>+</button>
              </div>
              {!isOutOfStock && currentStock <= 10 && <p className="max-qty-hint font-[Inter]">Max: {currentStock} available</p>}
            </div>

            {/* Delivery Estimate */}
            <div className="delivery-section">
              <div className="delivery-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                <div>
                  <p className="delivery-title font-[Inter]">Estimated Delivery: 3-5 Business Days</p>
                  {product.price >= 5000 ? <p className="delivery-free font-[Inter]">Free Shipping</p> : <p className="delivery-fee font-[Inter]">Shipping: Rs. 200 (Free above Rs. 5,000)</p>}
                </div>
              </div>
              <div className="delivery-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <p className="delivery-title font-[Inter]">Cash on Delivery Available</p>
              </div>
              <div className="delivery-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                <p className="delivery-title font-[Inter]">30-Day Easy Returns</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={handleAddToCart} className={`detail-cart-btn font-[Inter] ${isOutOfStock ? "btn-disabled" : ""}`} disabled={isOutOfStock || !selectedSize}>
                {isOutOfStock ? "Out of Stock" : `Add to Cart — Rs. ${product.price * quantity}`}
              </button>
              <button onClick={handleBuyNow} className={`buy-now-btn font-[Inter] ${isOutOfStock ? "btn-disabled" : ""}`} disabled={isOutOfStock || !selectedSize}>
                Buy Now
              </button>
              <button onClick={toggleWishlist} className={`wishlist-action-btn font-[Inter] ${wishlisted ? "wishlisted-btn" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "#ef4444" : "none"} stroke={wishlisted ? "#ef4444" : "currentColor"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {wishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Social Share */}
            <div className="share-section">
              <p className="share-label font-[Inter]">Share:</p>
              <div className="share-buttons">
                <button onClick={() => handleShare("whatsapp")} className="share-btn share-whatsapp" title="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button onClick={() => handleShare("facebook")} className="share-btn share-facebook" title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button onClick={() => handleShare("twitter")} className="share-btn share-twitter" title="X / Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button onClick={() => handleShare("copy")} className="share-btn share-copy" title="Copy Link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs-section">
          <div className="tabs-header">
            <button onClick={() => setActiveTab("description")} className={`tab-btn font-[Inter] ${activeTab === "description" ? "tab-active" : ""}`}>Description</button>
            <button onClick={() => setActiveTab("specs")} className={`tab-btn font-[Inter] ${activeTab === "specs" ? "tab-active" : ""}`}>Specifications</button>
            <button onClick={() => setActiveTab("shipping")} className={`tab-btn font-[Inter] ${activeTab === "shipping" ? "tab-active" : ""}`}>Shipping & Returns</button>
          </div>
          <div className="tab-content">
            {activeTab === "description" && (
              <div className="tab-panel">
                <p className="font-[Inter]">{product.description}</p>
                <p className="font-[Inter]" style={{ marginTop: "12px", color: "#6b7280" }}>Crafted with premium quality materials for ultimate comfort and style. Perfect for everyday wear and special occasions alike.</p>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="tab-panel">
                <div className="specs-grid">
                  <div className="spec-row"><span className="spec-label font-[Inter]">Category</span><span className="spec-value font-[Inter]">{product.category}</span></div>
                  {product.sku && <div className="spec-row"><span className="spec-label font-[Inter]">SKU</span><span className="spec-value font-[Inter]">{product.sku}</span></div>}
                  <div className="spec-row"><span className="spec-label font-[Inter]">Material</span><span className="spec-value font-[Inter]">100% Premium Cotton</span></div>
                  <div className="spec-row"><span className="spec-label font-[Inter]">Available Sizes</span><span className="spec-value font-[Inter]">{product.sizes?.map((s) => s.size).join(", ")}</span></div>
                  <div className="spec-row"><span className="spec-label font-[Inter]">Care</span><span className="spec-value font-[Inter]">Machine wash cold, tumble dry low</span></div>
                  <div className="spec-row"><span className="spec-label font-[Inter]">Fit</span><span className="spec-value font-[Inter]">Regular Fit</span></div>
                </div>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="tab-panel">
                <h4 className="tab-subtitle font-[Inter]">Shipping</h4>
                <p className="font-[Inter]">We deliver across Pakistan within 3-5 business days. Orders above Rs. 5,000 qualify for free shipping. A flat rate of Rs. 200 applies to all other orders.</p>
                <h4 className="tab-subtitle font-[Inter]" style={{ marginTop: "16px" }}>Returns & Exchange</h4>
                <p className="font-[Inter]">We offer a 30-day hassle-free return and exchange policy. Items must be in original condition with tags attached. Refunds processed within 5-7 business days.</p>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2 className="reviews-title font-[Playfair_Display]">Customer Reviews</h2>
            {isLoggedIn && (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="write-review-btn font-[Inter]">
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          <div className="rating-overview">
            <div className="rating-big">
              <span className="rating-big-number font-[Inter]">{avgRating || "0.0"}</span>
              {renderStars(Math.round(avgRating))}
              <span className="rating-total font-[Inter]">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="rating-bar-row">
                    <span className="bar-label font-[Inter]">{star}★</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }}></div></div>
                    <span className="bar-count font-[Inter]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <p className="form-label font-[Inter]">Your Rating</p>
              {renderStars(reviewForm.rating, true, (star) => setReviewForm({ ...reviewForm, rating: star }))}
              <textarea value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="Share your experience..." className="review-textarea font-[Inter]" rows="4" required></textarea>
              <button type="submit" className="submit-review-btn font-[Inter]">Submit Review</button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p className="no-reviews-text font-[Inter]">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-top">
                    <div className="reviewer-avatar font-[Inter]">{review.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="reviewer-name font-[Inter]">{review.name}</p>
                      <p className="review-date font-[Inter]">{review.date}</p>
                    </div>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                  </div>
                  <p className="review-text font-[Inter]">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2 className="related-heading font-[Playfair_Display]">You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map((p) => (<ProductCard key={p._id} product={p} />))}
          </div>
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-[Playfair_Display]">Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p className="modal-subtitle font-[Inter]">All measurements are in inches</p>
            <table className="size-table">
              <thead><tr><th className="font-[Inter]">Size</th><th className="font-[Inter]">Chest</th><th className="font-[Inter]">Waist</th><th className="font-[Inter]">Length</th><th className="font-[Inter]">Shoulder</th></tr></thead>
              <tbody>
                <tr><td>S</td><td>36</td><td>30</td><td>27</td><td>16</td></tr>
                <tr><td>M</td><td>38</td><td>32</td><td>28</td><td>17</td></tr>
                <tr><td>L</td><td>40</td><td>34</td><td>29</td><td>18</td></tr>
                <tr><td>XL</td><td>42</td><td>36</td><td>30</td><td>19</td></tr>
              </tbody>
            </table>
            <p className="modal-note font-[Inter]">Tip: If between sizes, order the larger size for a more comfortable fit.</p>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ProductDetail;