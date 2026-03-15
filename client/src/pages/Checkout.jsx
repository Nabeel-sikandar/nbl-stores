// Checkout Page — Cart + Buy Now + Coupon Code + Confetti
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ProductsNavbar from "../components/ProductsNavbar";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer";
import API from "../api/axios";
import "./Checkout.css";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { darkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const buyNowData = location.state;
  const isBuyNow = buyNowData?.buyNow;
  const buyNowItem = buyNowData?.item;

  const checkoutItems = isBuyNow ? [buyNowItem] : cart;
  const checkoutSubtotal = isBuyNow ? buyNowItem.price * buyNowItem.quantity : cartTotal;

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const discountAmount = couponApplied ? Math.min(couponApplied.discountAmount, checkoutSubtotal) : 0;
  const afterDiscount = Math.max(checkoutSubtotal - discountAmount, 0);
  const shippingFee = afterDiscount >= 5000 ? 0 : 200;
  const total = afterDiscount + shippingFee;

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shippingData, setShippingData] = useState({
    fullName: "", phone: "", address: "", city: "", postalCode: "",
  });

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await API.post("/coupons/validate", { code: couponCode, orderTotal: checkoutSubtotal });
      setCouponApplied(res.data.coupon);
      setCouponError("");
    } catch (err) {
      setCouponError(err.response?.data?.msg || "Invalid coupon");
      setCouponApplied(null);
    } finally { setCouponLoading(false); }
  };

  const removeCoupon = () => { setCouponApplied(null); setCouponCode(""); setCouponError(""); };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const orderItems = checkoutItems.map((item) => ({
        product: item._id || item.id, title: item.title, image: item.image,
        price: item.price, size: item.size, quantity: item.quantity,
      }));

      setOrderDetails({
        shippingData: { ...shippingData },
        coupon: couponApplied ? { code: couponApplied.code, discount: couponApplied.discount } : null,
        subtotal: checkoutSubtotal, discount: discountAmount, shipping: shippingFee, total: total,
      });

      await API.post("/orders", {
        items: orderItems, shippingInfo: shippingData, subtotal: checkoutSubtotal,
        discount: discountAmount, couponCode: couponApplied?.code || null, shippingFee, total,
      });

      setOrderPlaced(true);
      if (!isBuyNow) clearCart();
    } catch (err) { setError(err.response?.data?.msg || "Failed to place order"); }
    finally { setLoading(false); }
  };

  if (checkoutItems.length === 0 && !orderPlaced) {
    return (
      <div className={`checkout-page ${darkMode ? "checkout-dark" : ""}`}>
        <ProductsNavbar />
        <div className="checkout-empty">
          <h1 className="font-[Playfair_Display]">Your cart is empty</h1>
          <p className="font-[Inter]">Add some products before checking out.</p>
          <Link to="/products" className="back-to-shop font-[Inter]">← Back to Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className={`checkout-page ${darkMode ? "checkout-dark" : ""}`}>
        <ProductsNavbar />

        {/* CONFETTI RAIN */}
        <div className="confetti-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
              width: `${6 + Math.random() * 6}px`,
              height: `${6 + Math.random() * 6}px`,
            }}></div>
          ))}
        </div>

        <div className="order-confirmation">
          <div className="confirmation-icon">✓</div>
          <h1 className="confirmation-title font-[Playfair_Display]">Order Placed Successfully!</h1>
          <p className="confirmation-text font-[Inter]">Thank you for shopping with NBL Stores. Your order will be delivered to your address.</p>
          <div className="confirmation-details">
            <p className="font-[Inter]"><strong>Delivered to:</strong> {orderDetails.shippingData.fullName}</p>
            <p className="font-[Inter]"><strong>Address:</strong> {orderDetails.shippingData.address}, {orderDetails.shippingData.city}</p>
            <p className="font-[Inter]"><strong>Phone:</strong> {orderDetails.shippingData.phone}</p>
            <p className="font-[Inter]"><strong>Payment:</strong> Cash on Delivery</p>
            {orderDetails.coupon && <p className="font-[Inter]"><strong>Coupon:</strong> {orderDetails.coupon.code} (-{orderDetails.coupon.discount}%)</p>}
            {orderDetails.discount > 0 && <p className="font-[Inter]"><strong>Discount:</strong> - Rs. {orderDetails.discount}</p>}
            <p className="font-[Inter]"><strong>Subtotal:</strong> Rs. {orderDetails.subtotal}</p>
            <p className="font-[Inter]"><strong>Shipping:</strong> {orderDetails.shipping === 0 ? "FREE" : `Rs. ${orderDetails.shipping}`}</p>
            <p className="font-[Inter]" style={{ fontSize: "1.1rem", marginTop: "8px" }}><strong>Total:</strong> Rs. {orderDetails.total}</p>
          </div>
          <Link to="/products" className="continue-btn font-[Inter]">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`checkout-page ${darkMode ? "checkout-dark" : ""}`}>
      <ProductsNavbar />
      <div className="checkout-content">
        <h1 className="checkout-heading font-[Playfair_Display]">{isBuyNow ? "Quick Checkout" : "Checkout"}</h1>
        <div className="checkout-layout">
          <div className="shipping-section">
            <h2 className="section-title font-[Inter]">Shipping Information</h2>
            {error && <p className="auth-error font-[Inter]">{error}</p>}
            <form onSubmit={handlePlaceOrder} className="shipping-form">
              <div className="input-group"><label className="input-label font-[Inter]">Full Name</label><input type="text" name="fullName" value={shippingData.fullName} onChange={handleChange} placeholder="Enter your full name" className="input-field font-[Inter]" required /></div>
              <div className="input-group"><label className="input-label font-[Inter]">Phone Number</label><input type="tel" name="phone" value={shippingData.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" className="input-field font-[Inter]" required /></div>
              <div className="input-group"><label className="input-label font-[Inter]">Address</label><textarea name="address" value={shippingData.address} onChange={handleChange} placeholder="Enter your full address" className="input-textarea font-[Inter]" rows="3" required></textarea></div>
              <div className="input-row">
                <div className="input-group"><label className="input-label font-[Inter]">City</label><input type="text" name="city" value={shippingData.city} onChange={handleChange} placeholder="City" className="input-field font-[Inter]" required /></div>
                <div className="input-group"><label className="input-label font-[Inter]">Postal Code</label><input type="text" name="postalCode" value={shippingData.postalCode} onChange={handleChange} placeholder="Postal code" className="input-field font-[Inter]" /></div>
              </div>
              <div className="payment-section">
                <h2 className="section-title font-[Inter]">Payment Method</h2>
                <div className="payment-option">
                  <div className="payment-radio"><input type="radio" id="cod" name="payment" defaultChecked className="radio-input" /><label htmlFor="cod" className="payment-label font-[Inter]">Cash on Delivery (COD)</label></div>
                  <p className="payment-desc font-[Inter]">Pay when your order is delivered to your doorstep.</p>
                </div>
              </div>
              <button type="submit" className="place-order-btn font-[Inter]" disabled={loading}>{loading ? "Placing Order..." : `Place Order — Rs. ${total}`}</button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2 className="section-title font-[Inter]">Order Summary {isBuyNow && <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>(Quick Buy)</span>}</h2>
            <div className="summary-items">
              {checkoutItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <img src={item.image} alt={item.title} className="summary-item-image" />
                  <div className="summary-item-info"><p className="summary-item-title font-[Inter]">{item.title}</p><p className="summary-item-meta font-[Inter]">Size: {item.size} × {item.quantity}</p></div>
                  <p className="summary-item-price font-[Inter]">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="coupon-section">
              <p className="coupon-label font-[Inter]">Have a coupon?</p>
              {couponApplied ? (
                <div className="coupon-applied">
                  <div className="coupon-badge"><span className="coupon-code-text font-[Inter]">{couponApplied.code}</span><span className="coupon-discount-text font-[Inter]">-{couponApplied.discount}%</span></div>
                  <button onClick={removeCoupon} className="coupon-remove font-[Inter]">Remove</button>
                </div>
              ) : (
                <div className="coupon-input-row">
                  <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }} placeholder="Enter code" className="coupon-input font-[Inter]" />
                  <button type="button" onClick={handleApplyCoupon} className="coupon-apply-btn font-[Inter]" disabled={couponLoading || !couponCode.trim()}>{couponLoading ? "..." : "Apply"}</button>
                </div>
              )}
              {couponError && <p className="coupon-error font-[Inter]">{couponError}</p>}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row"><span className="summary-label font-[Inter]">Subtotal</span><span className="summary-value font-[Inter]">Rs. {checkoutSubtotal}</span></div>
            {couponApplied && <div className="summary-row discount-row"><span className="summary-label font-[Inter]">Discount ({couponApplied.discount}%)</span><span className="summary-value discount-value font-[Inter]">- Rs. {discountAmount}</span></div>}
            <div className="summary-row"><span className="summary-label font-[Inter]">Shipping</span><span className="summary-value font-[Inter]">{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total-row"><span className="summary-label font-[Inter]">Total</span><span className="summary-value font-[Inter]">Rs. {total}</span></div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Checkout;