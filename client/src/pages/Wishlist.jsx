// Wishlist Page — saved products from localStorage
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";
import BackToTop from "../components/BackToTop";
import "./Wishlist.css";

const Wishlist = () => {
  const { darkMode } = useTheme();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistIds = JSON.parse(localStorage.getItem("nbl-wishlist") || "[]");

        if (wishlistIds.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        // Saare products fetch karo aur wishlist wale filter karo
        const res = await API.get("/products");
        const filtered = res.data.products.filter((p) => wishlistIds.includes(p._id));
        setWishlistProducts(filtered);
      } catch (error) {
        console.error("Fetch Wishlist Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = (productId) => {
    const wishlistIds = JSON.parse(localStorage.getItem("nbl-wishlist") || "[]");
    const updated = wishlistIds.filter((id) => id !== productId);
    localStorage.setItem("nbl-wishlist", JSON.stringify(updated));
    setWishlistProducts(wishlistProducts.filter((p) => p._id !== productId));
  };

  const clearWishlist = () => {
    localStorage.setItem("nbl-wishlist", JSON.stringify([]));
    setWishlistProducts([]);
  };

  return (
    <div className={`wishlist-page ${darkMode ? "wishlist-dark" : ""}`}>
      <ProductsNavbar />

      <div className="wishlist-content">
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-title font-[Playfair_Display]">My Wishlist</h1>
            <p className="wishlist-subtitle font-[Inter]">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <button onClick={clearWishlist} className="clear-wishlist-btn font-[Inter]">
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : wishlistProducts.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h2 className="empty-title font-[Playfair_Display]">Your wishlist is empty</h2>
            <p className="empty-text font-[Inter]">Save items you love by clicking the heart icon on any product.</p>
            <Link to="/products" className="empty-btn font-[Inter]">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="wishlist-item">
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="remove-wishlist-btn"
                  title="Remove from wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Wishlist;