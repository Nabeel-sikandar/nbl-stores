// Disclaimer Page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import "./StaticPage.css";

const Disclaimer = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`static-page ${darkMode ? "static-dark" : ""}`}>
      <Navbar />

      <div className="static-content">
        <h1 className="static-title font-[Playfair_Display]">Disclaimer</h1>
        <p className="static-updated font-[Inter]">Last updated: March 2025</p>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">1. General Information</h2>
          <p className="static-text font-[Inter]">
            The information provided on NBL Stores is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">2. Product Images & Descriptions</h2>
          <p className="static-text font-[Inter]">
            We make every effort to display product colors and details as accurately as possible. However, actual colors may vary slightly due to monitor settings and lighting conditions during photography. Product descriptions are provided for informational purposes and may not cover every detail.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">3. External Links</h2>
          <p className="static-text font-[Inter]">
            Our website may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility for their privacy policies or content.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">4. Limitation of Liability</h2>
          <p className="static-text font-[Inter]">
            NBL Stores shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or the purchase of our products. Your use of any information or materials on this website is entirely at your own risk.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">5. Changes to This Disclaimer</h2>
          <p className="static-text font-[Inter]">
            We reserve the right to update or change this disclaimer at any time. Any changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the new disclaimer.
          </p>
        </div>

        <div className="static-section">
          <h2 className="static-heading font-[Inter]">6. Contact</h2>
          <p className="static-text font-[Inter]">
            If you have any concerns about this disclaimer, please contact us at support@nblstores.com.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Disclaimer;