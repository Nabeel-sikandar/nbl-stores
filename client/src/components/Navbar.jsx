// Navbar — Transparent on top, solid on scroll
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/nbl-stores-logo.svg";
import logoDark from "../assets/nbl-stores-logo-dark.svg";
import logoWhite from "../assets/nbl-stores-logo-white.svg";
import "./Navbar.css";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  // Home page pe transparent navbar
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Transparent mode: home page + not scrolled
  const isTransparent = isHomePage && !scrolled;

  return (
    <nav className={`navbar ${darkMode ? "navbar-dark" : ""} ${isTransparent ? "navbar-transparent" : "navbar-solid"}`}>
      <Link to="/">
        <img src={isTransparent ? logoWhite : (darkMode ? logoDark : logo)} alt="NBL Stores" className="navbar-logo-img" />
      </Link>

      <div className="navbar-links">
        <button onClick={toggleDarkMode} className="theme-toggle-btn" title="Toggle Theme">
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <Link to="/products" className={`nav-link font-[Inter] ${location.pathname === "/products" ? "nav-link-active" : ""}`}>Products</Link>
            <Link to="/cart" className="cart-btn font-[Inter]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-count-nav">{cartCount}</span>
            </Link>
            <span className="user-name font-[Inter]">Hi, {user?.name?.split(" ")[0]}</span>
            <button onClick={handleLogout} className="nav-btn-logout font-[Inter]">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin" className="nav-link font-[Inter]">Sign In</Link>
            <Link to="/signup" className="nav-btn font-[Inter]">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;