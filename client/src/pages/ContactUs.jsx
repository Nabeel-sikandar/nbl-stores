// Contact Us Page — with map and contact form
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import ProductsNavbar from "../components/ProductsNavbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { useToast } from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const ContactUs = () => {
  const { darkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you within 24 hours.", "success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const styles = {
    page: { minHeight: "100vh", backgroundColor: darkMode ? "#0a0a0a" : "#ffffff" },
    content: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 60px" },
    header: { textAlign: "center", marginBottom: "48px" },
    label: { fontSize: "0.8rem", letterSpacing: "4px", color: "#9ca3af", marginBottom: "8px", fontFamily: "Inter" },
    title: { fontSize: "2.5rem", color: darkMode ? "#fff" : "#111", marginBottom: "12px", fontFamily: "Playfair Display, serif", fontWeight: 700 },
    subtitle: { fontSize: "1rem", color: "#6b7280", fontFamily: "Inter" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" },
    cards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" },
    card: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "20px", border: `1px solid ${darkMode ? "#333" : "#f0f0f0"}`, borderRadius: "12px", backgroundColor: darkMode ? "#1a1a1a" : "#fff", transition: "all 0.3s ease" },
    cardIcon: { color: darkMode ? "#fff" : "#111", flexShrink: 0, marginTop: "2px" },
    cardTitle: { fontSize: "0.85rem", fontWeight: 600, color: darkMode ? "#fff" : "#111", marginBottom: "4px", fontFamily: "Inter" },
    cardText: { fontSize: "0.8rem", color: "#6b7280", fontFamily: "Inter" },
    mapContainer: { borderRadius: "12px", overflow: "hidden", border: `1px solid ${darkMode ? "#333" : "#f0f0f0"}` },
    formSection: { padding: "32px", backgroundColor: darkMode ? "#1a1a1a" : "#f9fafb", borderRadius: "16px", border: `1px solid ${darkMode ? "#333" : "#f0f0f0"}` },
    formHeading: { fontSize: "1.2rem", fontWeight: 600, color: darkMode ? "#fff" : "#111", marginBottom: "24px", fontFamily: "Inter" },
    form: { display: "flex", flexDirection: "column", gap: "18px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    inputLabel: { fontSize: "0.82rem", fontWeight: 500, color: darkMode ? "#d1d5db" : "#374151", fontFamily: "Inter" },
    input: { padding: "12px 14px", border: `1.5px solid ${darkMode ? "#333" : "#e5e7eb"}`, borderRadius: "8px", fontSize: "0.88rem", outline: "none", backgroundColor: darkMode ? "#111" : "#fff", color: darkMode ? "#fff" : "#111", fontFamily: "Inter", transition: "border-color 0.2s" },
    textarea: { padding: "12px 14px", border: `1.5px solid ${darkMode ? "#333" : "#e5e7eb"}`, borderRadius: "8px", fontSize: "0.88rem", outline: "none", resize: "vertical", backgroundColor: darkMode ? "#111" : "#fff", color: darkMode ? "#fff" : "#111", fontFamily: "Inter", transition: "border-color 0.2s" },
    submitBtn: { padding: "14px", backgroundColor: darkMode ? "#fff" : "#111", color: darkMode ? "#111" : "#fff", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter", transition: "all 0.3s ease" },
  };

  // Mobile responsive override
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div style={styles.page}>
      <Helmet>
        <title>Contact Us | NBL Stores</title>
        <meta name="description" content="Get in touch with NBL Stores. We'd love to hear from you." />
      </Helmet>

      {isLoggedIn ? <ProductsNavbar /> : <Navbar />}

      <div style={styles.content}>
        <div style={styles.header}>
          <p style={styles.label}>GET IN TOUCH</p>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          {/* Left — Contact Info + Map */}
          <div>
            <div style={{ ...styles.cards, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
              <div style={styles.card}>
                <div style={styles.cardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Our Location</h3>
                  <p style={styles.cardText}>Lower Dir, KPK, Pakistan</p>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Email Us</h3>
                  <p style={styles.cardText}>support@nblstores.com</p>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Call Us</h3>
                  <p style={styles.cardText}>+92 312 1234567</p>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Business Hours</h3>
                  <p style={styles.cardText}>Mon - Sat: 9 AM - 8 PM</p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div style={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207298.26898518!2d71.75!3d35.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38db4b5c7c9e3b3d%3A0x1c2f0b5e5e0a5a0a!2sLower%20Dir%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NBL Stores Location"
              ></iframe>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div style={styles.formSection}>
            <h2 style={styles.formHeading}>Send us a Message</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more..." style={styles.textarea} rows="5" required></textarea>
              </div>
              <button type="submit" style={styles.submitBtn}>Send Message</button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ContactUs;