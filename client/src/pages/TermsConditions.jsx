// Terms & Conditions Page — Premium UI
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import ProductsNavbar from "../components/ProductsNavbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const TermsConditions = () => {
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: darkMode ? "#0a0a0a" : "#ffffff",
      transition: "background-color 0.3s ease",
    },
    content: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px 80px",
    },
    badge: {
      display: "inline-block",
      fontSize: "0.72rem",
      letterSpacing: "3px",
      color: darkMode ? "#6b7280" : "#9ca3af",
      fontWeight: 500,
      marginBottom: "12px",
      fontFamily: "Inter, sans-serif",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: darkMode ? "#ffffff" : "#111111",
      marginBottom: "12px",
      fontFamily: "Playfair Display, serif",
      lineHeight: 1.2,
    },
    updated: {
      fontSize: "0.82rem",
      color: darkMode ? "#6b7280" : "#9ca3af",
      marginBottom: "40px",
      fontFamily: "Inter, sans-serif",
    },
    divider: {
      height: "1px",
      backgroundColor: darkMode ? "#222" : "#f0f0f0",
      margin: "32px 0",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: darkMode ? "#ffffff" : "#111111",
      marginBottom: "12px",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    sectionNumber: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: darkMode ? "#ffffff" : "#111111",
      color: darkMode ? "#111111" : "#ffffff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      fontWeight: 700,
      flexShrink: 0,
    },
    paragraph: {
      fontSize: "0.9rem",
      color: darkMode ? "#9ca3af" : "#6b7280",
      lineHeight: 1.8,
      marginBottom: "16px",
      fontFamily: "Inter, sans-serif",
    },
    card: {
      backgroundColor: darkMode ? "#1a1a1a" : "#f9fafb",
      border: `1px solid ${darkMode ? "#333" : "#f0f0f0"}`,
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
    },
    contactBox: {
      backgroundColor: darkMode ? "#1a1a1a" : "#f9fafb",
      border: `1px solid ${darkMode ? "#333" : "#f0f0f0"}`,
      borderRadius: "12px",
      padding: "24px",
      marginTop: "32px",
      textAlign: "center",
    },
    contactTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: darkMode ? "#ffffff" : "#111111",
      marginBottom: "8px",
      fontFamily: "Inter, sans-serif",
    },
    contactText: {
      fontSize: "0.85rem",
      color: darkMode ? "#9ca3af" : "#6b7280",
      fontFamily: "Inter, sans-serif",
    },
    contactLink: {
      color: darkMode ? "#ffffff" : "#111111",
      fontWeight: 600,
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.page}>
      {isLoggedIn ? <ProductsNavbar /> : <Navbar />}

      <div style={styles.content}>
        <p style={styles.badge}>LEGAL</p>
        <h1 style={styles.title}>Terms & Conditions</h1>
        <p style={styles.updated}>Last updated: March 15, 2026</p>

        <div style={styles.card}>
          <p style={styles.paragraph}>
            Welcome to NBL Stores. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchase or using our services.
          </p>
        </div>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>1</span> Acceptance of Terms</h2>
        <p style={styles.paragraph}>
          By accessing and using NBL Stores website (nbl-stores.vercel.app), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all visitors, users, and others who access or use the service.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>2</span> Products & Pricing</h2>
        <p style={styles.paragraph}>
          All products displayed on our website are subject to availability. We reserve the right to discontinue any product at any time without prior notice. Prices for our products are displayed in Pakistani Rupees (PKR) and are subject to change without notice. We make every effort to display accurate pricing, but errors may occur. In such cases, we reserve the right to cancel orders placed at incorrect prices.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>3</span> Orders & Payment</h2>
        <p style={styles.paragraph}>
          When you place an order, you are making an offer to purchase the selected products. We reserve the right to accept or reject any order. Currently, we accept Cash on Delivery (COD) as the payment method. The total amount including shipping fees is due upon delivery. Stock is deducted at the time of order placement to ensure product availability.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>4</span> Shipping & Delivery</h2>
        <p style={styles.paragraph}>
          We deliver across Pakistan within 3-5 business days. Orders above Rs. 5,000 qualify for free shipping. A flat rate of Rs. 200 applies to all other orders. While we strive to deliver within the estimated time, delays may occur due to circumstances beyond our control. Delivery times are estimates and not guarantees.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>5</span> Returns & Exchanges</h2>
        <p style={styles.paragraph}>
          We offer a 30-day return and exchange policy. Items must be returned in their original condition with tags attached and original packaging. To initiate a return, contact our customer support team. Refunds will be processed within 5-7 business days after we receive the returned item. Shipping costs for returns are borne by the customer unless the return is due to a defect or our error.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>6</span> User Accounts</h2>
        <p style={styles.paragraph}>
          When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized access. We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>7</span> Intellectual Property</h2>
        <p style={styles.paragraph}>
          All content on this website, including text, graphics, logos, images, product descriptions, and software, is the property of NBL Stores and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written permission. The NBL Stores logo and brand name are our trademarks.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>8</span> Coupon Codes & Promotions</h2>
        <p style={styles.paragraph}>
          Coupon codes and promotional offers are subject to specific terms and conditions. They may have minimum order requirements, expiration dates, and usage limits. Coupon codes cannot be combined unless explicitly stated. We reserve the right to modify or cancel any promotion at any time. Abuse of promotional offers may result in order cancellation.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>9</span> Limitation of Liability</h2>
        <p style={styles.paragraph}>
          NBL Stores shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or purchase of our products. Our total liability shall not exceed the amount paid by you for the specific product that gave rise to the claim. We do not guarantee that our website will be uninterrupted, error-free, or free of viruses.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>10</span> Changes to Terms</h2>
        <p style={styles.paragraph}>
          We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting on the website. Your continued use of our website after any changes constitutes acceptance of the updated terms. We encourage you to review these terms periodically.
        </p>

        <div style={styles.contactBox}>
          <p style={styles.contactTitle}>Questions about our Terms?</p>
          <p style={styles.contactText}>
            Contact us at <a href="mailto:support@nblstores.com" style={styles.contactLink}>support@nblstores.com</a>
          </p>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default TermsConditions;