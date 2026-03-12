// Home Page — Full premium landing page connected to backend
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";
import BackToTop from "../components/BackToTop";
import "./Home.css";

const Home = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // Backend se products fetch karo
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setAllProducts(res.data.products);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchProducts();
  }, []);

  // Featured — pehle 4 products
  const featuredProducts = allProducts.slice(0, 4);

  // New arrivals — last 3 products
  const newArrivals = allProducts.slice(-3);
  //stay in the loop form submit handler
  const handleNewsletter = (e) => {
  e.preventDefault();
  setShowToast(true);
  setEmail("");
  setTimeout(() => setShowToast(false), 4000); // 4 sec baad hide
};

  return (
    <div className={`home-page ${darkMode ? "home-dark" : ""}`}>
      <Navbar />

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <p className="hero-subtitle font-[Inter]">PREMIUM FASHION STORE</p>
        <h1 className="hero-title font-[Playfair_Display]">Wear the Difference</h1>
        <p className="hero-desc font-[Inter]">
          Style that speaks. Shop the latest trends in men's, women's, and kids'
          fashion. Premium quality, honest prices.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="hero-btn-primary font-[Inter]">Explore Collection</Link>
        </div>
      </section>

      {/* ===== 2. NEW ARRIVALS ===== */}
      <section className="arrivals-section">
        <div className="section-container">
          <p className="section-label font-[Inter]">JUST DROPPED</p>
          <h2 className="section-title font-[Playfair_Display]">New Arrivals</h2>
          <div className="arrivals-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. FEATURED PRODUCTS ===== */}
      <section className="featured-section">
        <div className="section-container">
          <p className="section-label font-[Inter]">HANDPICKED FOR YOU</p>
          <h2 className="section-title font-[Playfair_Display]">Featured Products</h2>
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/products" className="view-all-btn font-[Inter]">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* ===== 4. CATEGORIES ===== */}
      <section className="categories-section">
        <div className="section-container">
          <p className="section-label font-[Inter]">BROWSE BY</p>
          <h2 className="section-title font-[Playfair_Display]">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600" alt="Men" className="category-image" loading="lazy" />
              <div className="category-overlay">
                <h3 className="category-name font-[Inter]">Men</h3>
                <p className="category-cta font-[Inter]">Shop Now →</p>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600" alt="Women" className="category-image" loading="lazy" />
              <div className="category-overlay">
                <h3 className="category-name font-[Inter]">Women</h3>
                <p className="category-cta font-[Inter]">Shop Now →</p>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600" alt="Kids" className="category-image" loading="lazy" />
              <div className="category-overlay">
                <h3 className="category-name font-[Inter]">Kids</h3>
                <p className="category-cta font-[Inter]">Shop Now →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. BRAND STORY ===== */}
      <section className="brand-section">
        <div className="section-container">
          <div className="brand-grid">
            <div className="brand-image-container">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="NBL Stores" className="brand-image" loading="lazy" />
            </div>
            <div className="brand-info">
              <p className="section-label font-[Inter]">OUR STORY</p>
              <h2 className="brand-title font-[Playfair_Display]">About NBL Stores</h2>
              <p className="brand-desc font-[Inter]">
                NBL Stores was founded with a simple mission — to bring premium fashion to everyone at affordable prices. We believe that style shouldn't come with a hefty price tag.
              </p>
              <p className="brand-desc font-[Inter]">
                Every piece in our collection is carefully curated and crafted from high-quality materials. From classic essentials to trendy statement pieces, we've got something for every member of the family.
              </p>
              <Link to="/products" className="brand-btn font-[Inter]">Explore Our Collection →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. STATS ===== */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <p className="stat-number font-[Inter]">500+</p>
              <p className="stat-text font-[Inter]">Premium Products</p>
            </div>
            <div className="stat-item">
              <p className="stat-number font-[Inter]">2,000+</p>
              <p className="stat-text font-[Inter]">Happy Customers</p>
            </div>
            <div className="stat-item">
              <p className="stat-number font-[Inter]">50+</p>
              <p className="stat-text font-[Inter]">Cities Delivered</p>
            </div>
            <div className="stat-item">
              <p className="stat-number font-[Inter]">4.9★</p>
              <p className="stat-text font-[Inter]">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. WHY CHOOSE US ===== */}
      <section className="why-section">
        <div className="section-container">
          <p className="section-label font-[Inter]">WHY NBL STORES</p>
          <h2 className="section-title font-[Playfair_Display]">Why Choose Us</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </div>
              <h3 className="why-title font-[Inter]">Premium Quality</h3>
              <p className="why-desc font-[Inter]">Every piece is crafted from the finest materials, ensuring comfort and durability that lasts.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="why-title font-[Inter]">Fast Delivery</h3>
              <p className="why-desc font-[Inter]">Get your order delivered within 3-5 business days. Free shipping on orders above Rs. 5,000.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="why-title font-[Inter]">Secure Shopping</h3>
              <p className="why-desc font-[Inter]">Your data is safe with us. Secure checkout with Cash on Delivery option available.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              </div>
              <h3 className="why-title font-[Inter]">Easy Returns</h3>
              <p className="why-desc font-[Inter]">Not satisfied? Return within 30 days for a full refund. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="section-container">
          <p className="section-label font-[Inter]">WHAT PEOPLE SAY</p>
          <h2 className="section-title font-[Playfair_Display]">Customer Reviews</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text font-[Inter]">
                "Amazing quality! The fabric is so soft and the fit is perfect. Will definitely order again from NBL Stores."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar font-[Inter]">AK</div>
                <div>
                  <p className="author-name font-[Inter]">Ali Khan</p>
                  <p className="author-location font-[Inter]">Islamabad</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text font-[Inter]">
                "Fast delivery and great customer service. The dress I ordered looked even better in person. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar font-[Inter]">SA</div>
                <div>
                  <p className="author-name font-[Inter]">Sara Ahmed</p>
                  <p className="author-location font-[Inter]">Lahore</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text font-[Inter]">
                "Best online fashion store in Pakistan. Premium quality at affordable prices. My kids love the clothes!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar font-[Inter]">FN</div>
                <div>
                  <p className="author-name font-[Inter]">Fatima Noor</p>
                  <p className="author-location font-[Inter]">Peshawar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 9. NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="section-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title font-[Playfair_Display]">Stay in the Loop</h2>
            <p className="newsletter-desc font-[Inter]">
              Subscribe to get exclusive offers, new arrivals updates, and 10% off your first order.
            </p>
            <form onSubmit={handleNewsletter} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="newsletter-input font-[Inter]"
                required
              />
              <button type="submit" className="newsletter-btn font-[Inter]">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== 10. FEATURES BAR ===== */}
      <section className="features-bar">
        <div className="features-bar-content">
          <div className="feature-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <p className="feature-title font-[Inter]">FREE SHIPPING</p>
              <p className="feature-desc font-[Inter]">Free shipping on orders over Rs. 5,000</p>
            </div>
          </div>
          <div className="feature-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            <div>
              <p className="feature-title font-[Inter]">EXCHANGE & RETURN</p>
              <p className="feature-desc font-[Inter]">30 day exchanges & returns</p>
            </div>
          </div>
          <div className="feature-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div>
              <p className="feature-title font-[Inter]">SECURE CHECKOUT</p>
              <p className="feature-desc font-[Inter]">Quick, secure one-page checkout</p>
            </div>
          </div>
          <div className="feature-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p className="feature-title font-[Inter]">NO RE-STOCK FEES</p>
              <p className="feature-desc font-[Inter]">Not happy? Send back and get full refund</p>
            </div>
          </div>
        </div>
      </section>
     {/* Toast Notification */}
{showToast && (
  <div className="toast-notification">
    <div className="toast-icon">✓</div>
    <div className="toast-text">
      <p className="toast-title font-[Inter]">Subscribed Successfully!</p>
      <p className="toast-desc font-[Inter]">You'll receive exclusive offers and updates.</p>
    </div>
    <button onClick={() => setShowToast(false)} className="toast-close">✕</button>
  </div>
)}
      {/* ===== 11. FOOTER ===== */}
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Home;