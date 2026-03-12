import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/nbl-stores-logo.svg";
import logoDark from "../assets/nbl-stores-logo-dark.svg";
import "./ProductsNavbar.css";

const ProductsNavbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();

  const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/signin");
};

  return (
    <nav className={`products-navbar ${darkMode ? "products-navbar-dark" : ""}`}>
      <Link to="/">
        <img src={darkMode ? logoDark : logo} alt="NBL Stores" className="products-navbar-logo-img" />
      </Link>

      <div className="products-navbar-links">
        <button onClick={toggleDarkMode} className="theme-toggle-btn" title="Toggle Theme">
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>

        <Link to="/cart" className="cart-btn font-[Inter]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Cart
          <span className="cart-count">{cartCount}</span>
        </Link>
        {/* Wishlist */}
<Link to="/wishlist" className="nav-icon-btn font-[Inter]">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
</Link>

{/* My Orders */}
<Link to="/my-orders" className="nav-icon-btn font-[Inter]">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
  <line x1="12" y1="22.08" x2="12" y2="12"/>
</svg>
</Link>

        <button onClick={handleLogout} className="logout-btn font-[Inter]">Logout</button>
      </div>
    </nav>
  );
};

export default ProductsNavbar;