// Privacy Policy Page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import "./StaticPage.css";

const PrivacyPolicy = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`static-page ${darkMode ? "static-dark" : ""}`}>
      <Navbar />

      <div className="static-content">
        <h1 className="static-title font-[Playfair_Display]">Privacy Policy</h1>
        <p className="static-updated font-[Inter]">Last updated: March 2025</p>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">1. Information We Collect</h2>
          <p className="static-text font-[Inter]">
            At NBL Stores, we collect information that you provide directly to us when you create an account, place an order, or contact us. This includes:
          </p>
          <ul className="static-list font-[Inter]">
            <li>Full name, email address, and phone number</li>
            <li>Shipping and billing address</li>
            <li>Order history and preferences</li>
            <li>Device and browser information for analytics</li>
          </ul>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">2. How We Use Your Information</h2>
          <p className="static-text font-[Inter]">
            We use the information we collect to process your orders, communicate with you about your purchases, improve our services, and personalize your shopping experience. We may also use your information to send promotional offers and updates, which you can opt out of at any time.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">3. Information Sharing</h2>
          <p className="static-text font-[Inter]">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only with trusted service providers who assist us in operating our website, processing payments, and delivering orders to you.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">4. Data Security</h2>
          <p className="static-text font-[Inter]">
            We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">5. Cookies</h2>
          <p className="static-text font-[Inter]">
            Our website uses cookies to enhance your browsing experience. Cookies help us remember your preferences, analyze site traffic, and improve our services. You can disable cookies through your browser settings, but some features of the website may not function properly.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">6. Contact Us</h2>
          <p className="static-text font-[Inter]">
            If you have any questions about this Privacy Policy, please contact us at support@nblstores.com or through our contact form in the footer.
          </p>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default PrivacyPolicy;