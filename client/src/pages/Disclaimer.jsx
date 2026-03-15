// Disclaimer Page — Premium UI
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import ProductsNavbar from "../components/ProductsNavbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const Disclaimer = () => {
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
    warningCard: {
      backgroundColor: darkMode ? "#1c1917" : "#fffbeb",
      border: `1px solid ${darkMode ? "#422006" : "#fef3c7"}`,
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    },
    warningIcon: {
      fontSize: "1.2rem",
      flexShrink: 0,
      marginTop: "2px",
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
        <h1 style={styles.title}>Disclaimer</h1>
        <p style={styles.updated}>Last updated: March 15, 2026</p>

        <div style={styles.warningCard}>
          <span style={styles.warningIcon}>⚠️</span>
          <p style={{ ...styles.paragraph, marginBottom: 0, color: darkMode ? "#fbbf24" : "#92400e" }}>
            Please read this disclaimer carefully before using NBL Stores website. By using our website, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
          </p>
        </div>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>1</span> General Information</h2>
        <p style={styles.paragraph}>
          The information provided on NBL Stores website is for general informational and e-commerce purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>2</span> Product Information</h2>
        <p style={styles.paragraph}>
          We make every effort to display product colors, sizes, and details as accurately as possible. However, we cannot guarantee that your device's display accurately reflects the actual colors of our products. Slight variations in color, texture, and appearance may occur between the product shown on screen and the actual item received. Product images are for illustrative purposes only.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>3</span> Educational Project Disclaimer</h2>
        <div style={styles.card}>
          <p style={styles.paragraph}>
            NBL Stores is developed as a university coursework project for educational purposes at COMSATS University Abbottabad. While it demonstrates a fully functional e-commerce platform, it is primarily a learning project. The products listed, pricing, and business information should be treated as demonstrative content. This project showcases full-stack web development skills using the MERN (MongoDB, Express.js, React.js, Node.js) technology stack.
          </p>
        </div>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>4</span> External Links</h2>
        <p style={styles.paragraph}>
          Our website may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>5</span> Website Availability</h2>
        <p style={styles.paragraph}>
          We strive to keep the website running smoothly at all times. However, we are not responsible for any temporary unavailability due to technical issues, server maintenance, hosting limitations, or circumstances beyond our control. As the website is hosted on free-tier services, occasional downtime or slower response times may occur. We do not guarantee uninterrupted access to our services.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>6</span> Limitation of Liability</h2>
        <p style={styles.paragraph}>
          In no event shall NBL Stores, its developers, or affiliates be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website. Your use of this website and any reliance on the information is solely at your own risk.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>7</span> Payment Security</h2>
        <p style={styles.paragraph}>
          Currently, NBL Stores operates on a Cash on Delivery (COD) model. No online payment information is collected or stored. User authentication is handled through secure JWT tokens and Google OAuth. While we implement industry-standard security practices including encrypted passwords and secure API endpoints, no system is completely immune to security risks.
        </p>

        <div style={styles.divider}></div>

        <h2 style={styles.sectionTitle}><span style={styles.sectionNumber}>8</span> Changes to This Disclaimer</h2>
        <p style={styles.paragraph}>
          We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting on this page. By continuing to use the website after changes are posted, you accept the modified disclaimer. We recommend reviewing this page periodically for any updates.
        </p>

        <div style={styles.contactBox}>
          <p style={styles.contactTitle}>Have concerns?</p>
          <p style={styles.contactText}>
            Reach out to us at <a href="mailto:support@nblstores.com" style={styles.contactLink}>support@nblstores.com</a>
          </p>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Disclaimer;