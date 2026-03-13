import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import ProductsNavbar from "../components/ProductsNavbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart();
  const { darkMode } = useTheme();

  // Helper — get product ID (_id ya id)
  const getId = (item) => item._id || item.id;

  return (
    <div className={`cart-page ${darkMode ? "cart-dark" : ""}`}>
      <ProductsNavbar />

      <div className="cart-content">
        <h1 className="cart-heading font-[Playfair_Display]">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-cart-illustration">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <div className="empty-cart-dots">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
              </div>
            </div>
            <h1 className="empty-cart-title font-[Playfair_Display]">Your Cart is Empty</h1>
            <p className="empty-cart-text font-[Inter]">Looks like you haven't added anything to your cart yet. Browse our collection and find something you love!</p>
            <Link to="/products" className="empty-cart-btn font-[Inter]">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <Link to={`/products/${getId(item)}`} className="cart-item-image-link">
                    <img src={item.image} alt={item.title} className="cart-item-image" />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/products/${getId(item)}`} className="cart-item-title-link">
                      <h3 className="cart-item-title font-[Inter]">{item.title}</h3>
                    </Link>
                    <p className="cart-item-size font-[Inter]">Size: {item.size}</p>
                    <p className="cart-item-price font-[Inter]">Rs. {item.price}</p>
                    <div className="cart-qty-controls">
                      <button onClick={() => decreaseQuantity(getId(item), item.size)} className="cart-qty-btn font-[Inter]">−</button>
                      <span className="cart-qty-value font-[Inter]">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(getId(item), item.size)} className="cart-qty-btn font-[Inter]">+</button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <p className="cart-item-subtotal font-[Inter]">Rs. {item.price * item.quantity}</p>
                    <button onClick={() => removeFromCart(getId(item), item.size)} className="cart-remove-btn font-[Inter]">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h2 className="summary-heading font-[Inter]">Order Summary</h2>
              <div className="summary-row">
                <span className="summary-label font-[Inter]">Subtotal</span>
                <span className="summary-value font-[Inter]">Rs. {cartTotal}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label font-[Inter]">Shipping</span>
                <span className="summary-value font-[Inter]">{cartTotal >= 5000 ? "FREE" : "Rs. 200"}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span className="summary-label font-[Inter]">Total</span>
                <span className="summary-value font-[Inter]">Rs. {cartTotal >= 5000 ? cartTotal : cartTotal + 200}</span>
              </div>
              <Link to="/checkout" className="checkout-btn font-[Inter]">Proceed to Checkout</Link>
              <Link to="/products" className="keep-shopping font-[Inter]">← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Cart;