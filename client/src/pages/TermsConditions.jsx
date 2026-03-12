// Terms & Conditions Page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import BackToTop from "../components/BackToTop";
import "./StaticPage.css";

const TermsConditions = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`static-page ${darkMode ? "static-dark" : ""}`}>
      <Navbar />

      <div className="static-content">
        <h1 className="static-title font-[Playfair_Display]">Terms & Conditions</h1>
        <p className="static-updated font-[Inter]">Last updated: March 2025</p>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">1. Acceptance of Terms</h2>
          <p className="static-text font-[Inter]">
            By accessing and using NBL Stores, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">2. Products & Pricing</h2>
          <p className="static-text font-[Inter]">
            All products are subject to availability. Prices are listed in Pakistani Rupees (PKR) and may change without prior notice. We reserve the right to modify or discontinue any product at any time.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">3. Orders & Payments</h2>
          <ul className="static-list font-[Inter]">
            <li>All orders are subject to acceptance and availability</li>
            <li>We currently accept Cash on Delivery (COD) as our payment method</li>
            <li>Orders above Rs. 5,000 qualify for free shipping</li>
            <li>Standard shipping fee is Rs. 200 for orders below Rs. 5,000</li>
          </ul>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">4. Shipping & Delivery</h2>
          <p className="static-text font-[Inter]">
            We aim to deliver your order within 3-5 business days across Pakistan. Delivery times may vary depending on your location. You will receive a confirmation once your order is shipped.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">5. Returns & Exchanges</h2>
          <p className="static-text font-[Inter]">
            We offer a 30-day return and exchange policy. Items must be unused, unwashed, and in their original packaging. To initiate a return, please contact our support team with your order details.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">6. User Accounts</h2>
          <p className="static-text font-[Inter]">
            You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">7. Intellectual Property</h2>
          <p className="static-text font-[Inter]">
            All content on this website, including logos, text, images, and designs, is the property of NBL Stores and is protected by copyright laws. Unauthorized use or reproduction is strictly prohibited.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">8. Contact</h2>
          <p className="static-text font-[Inter]">
            For any questions regarding these terms, reach out to us at support@nblstores.com.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;