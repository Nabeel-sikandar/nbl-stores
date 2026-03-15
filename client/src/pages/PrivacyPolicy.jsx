// Privacy Policy Page — Premium UI
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import ProductsNavbar from "../components/ProductsNavbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const PrivacyPolicy = () => {
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
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.updated}>Last updated: March 15, 2026</p>

        <div style={styles.card}>
          <p style={styles.paragraph}>
            At NBL Stores, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from our store.
          </p>
        </div>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>1</span> Information We Collect</h2>
        <p style={styles.paragraph}>
          We collect personal information that you voluntarily provide to us when you register on the website, place an order, subscribe to our newsletter, or contact us. This information may include your name, email address, phone number, shipping address, and payment details.
        </p>
        <p style={styles.paragraph}>
          We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>2</span> How We Use Your Information</h2>
        <p style={styles.paragraph}>
          We use the information we collect to process and fulfill your orders, including shipping and payment processing. We also use it to communicate with you about your orders, respond to your inquiries, send promotional emails about new products or special offers (with your consent), improve our website and services, and protect against fraudulent transactions.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>3</span> Information Sharing</h2>
        <p style={styles.paragraph}>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except to trusted third parties who assist us in operating our website, conducting our business, or serving you — as long as those parties agree to keep this information confidential. This includes payment processors, shipping carriers, and cloud service providers.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>4</span> Data Security</h2>
        <p style={styles.paragraph}>
          We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers with encryption. All payment transactions are processed through secure payment gateways and are not stored on our servers. We use JWT (JSON Web Tokens) for secure authentication.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>5</span> Cookies</h2>
        <p style={styles.paragraph}>
          Our website uses cookies and local storage to enhance your browsing experience. Cookies help us remember your preferences, keep you signed in, maintain your shopping cart, and provide personalized content. You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>6</span> Third-Party Services</h2>
        <p style={styles.paragraph}>
          We may use third-party services such as Google OAuth for authentication, Cloudinary for image storage, and MongoDB Atlas for database services. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the practices of third-party services.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>7</span> Your Rights</h2>
        <p style={styles.paragraph}>
          You have the right to access, correct, or delete your personal information at any time. You can update your account information through your profile settings. You may also request that we delete your account and associated data by contacting our support team. You can opt out of promotional emails at any time by clicking the unsubscribe link.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>8</span> Changes to This Policy</h2>
        <p style={styles.paragraph}>
          We reserve the right to update or change this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Your continued use of our website after any changes constitutes your acceptance of the new policy.
        </p>

        <div style={styles.contactBox}>
          <p style={styles.contactTitle}>Questions about our Privacy Policy?</p>
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

export default PrivacyPolicy;