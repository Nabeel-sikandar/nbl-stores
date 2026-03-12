import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import ProductsNavbar from "../components/ProductsNavbar";
import Footer from "../components/Footer";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart();
  const { darkMode } = useTheme();

  return (
    <div className={`cart-page ${darkMode ? "cart-dark" : ""}`}>
      <ProductsNavbar />

      <div className="cart-content">
        <h1 className="cart-heading font-[Playfair_Display]">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-text font-[Inter]">Your cart is empty</p>
            <Link to="/products" className="continue-shopping font-[Inter]">← Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <Link to={`/products/${item.id}`} className="cart-item-image-link">
                    <img src={item.image} alt={item.title} className="cart-item-image" />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/products/${item.id}`} className="cart-item-title-link">
                      <h3 className="cart-item-title font-[Inter]">{item.title}</h3>
                    </Link>
                    <p className="cart-item-size font-[Inter]">Size: {item.size}</p>
                    <p className="cart-item-price font-[Inter]">Rs. {item.price}</p>
                    <div className="cart-qty-controls">
                      <button onClick={() => decreaseQuantity(item.id, item.size)} className="cart-qty-btn font-[Inter]">−</button>
                      <span className="cart-qty-value font-[Inter]">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id, item.size)} className="cart-qty-btn font-[Inter]">+</button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <p className="cart-item-subtotal font-[Inter]">Rs. {item.price * item.quantity}</p>
                    <button onClick={() => removeFromCart(item.id, item.size)} className="cart-remove-btn font-[Inter]">Remove</button>
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
    </div>
  );
};

export default Cart;