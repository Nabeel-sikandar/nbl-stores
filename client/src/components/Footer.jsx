// Footer — har page pe dikhega, contact form + links
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logoDark from "../assets/nbl-stores-logo-dark.svg";
import "./Footer.css";

const Footer = () => {
  const { darkMode } = useTheme();

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form:", contactData);
    alert("Message sent successfully!");
    setContactData({ name: "", email: "", message: "" });
  };

  return (
    <footer className={`footer ${darkMode ? "footer-dark" : ""}`}>
      <div className="footer-content">
        {/* Column 1 — Brand */}
        <div className="footer-brand">
          <img src={logoDark} alt="NBL Stores" className="footer-logo-img" />
          <p className="footer-tagline font-[Inter]">
  Premium fashion for men, women & kids. Quality fabrics, modern designs, and honest prices — delivered across Pakistan. Your style, our commitment.
</p>
          {/* Social Icons */}
          <div className="social-icons">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2 — Quick Links + Legal */}
<div className="footer-links-section">
  <h3 className="footer-heading font-[Inter]">Quick Links</h3>
  <div className="footer-links">
    <Link to="/" className="footer-link font-[Inter]">Home</Link>
    <Link to="/products" className="footer-link font-[Inter]">Products</Link>
    <Link to="/cart" className="footer-link font-[Inter]">Cart</Link>
    <Link to="/signup" className="footer-link font-[Inter]">Sign Up</Link>

    <Link to="/privacy-policy" className="footer-link font-[Inter]">Privacy Policy</Link>
    <Link to="/terms-conditions" className="footer-link font-[Inter]">Terms & Conditions</Link>
    <Link to="/disclaimer" className="footer-link font-[Inter]">Disclaimer</Link>
  </div>
</div>

        {/* Column 3 — Contact Form */}
        <div className="footer-contact">
          <h3 className="footer-heading font-[Inter]">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              value={contactData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="contact-input font-[Inter]"
              required
            />
            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              placeholder="Your email"
              className="contact-input font-[Inter]"
              required
            />
            <textarea
              name="message"
              value={contactData.message}
              onChange={handleChange}
              placeholder="Your message"
              className="contact-textarea font-[Inter]"
              rows="3"
              required
            ></textarea>
            <button type="submit" className="contact-btn font-[Inter]">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright font-[Inter]">
          © 2026 NBL Stores. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;