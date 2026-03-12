// Admin SignIn — connected to backend
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./AdminSignIn.css";

const AdminSignIn = () => {
  const { darkMode } = useTheme();
  const { adminSignin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminSignin(formData.email, formData.password);
      navigate("/admin"); // admin panel pe redirect
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-signin-page ${darkMode ? "admin-signin-dark" : ""}`}>
      <div className="admin-signin-container">
        <div className="admin-badge font-[Inter]">ADMIN ACCESS</div>
        <h1 className="admin-signin-title font-[Playfair_Display]">Admin Panel</h1>
        <p className="admin-signin-subtitle font-[Inter]">Authorized personnel only</p>

        {/* Error message */}
        {error && <p className="auth-error font-[Inter]">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-signin-form">
          <div className="input-group">
            <label className="input-label font-[Inter]">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Admin email" className="input-field font-[Inter]" required />
          </div>
          <div className="input-group">
            <label className="input-label font-[Inter]">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Admin password" className="input-field font-[Inter]" required />
          </div>
          <button type="submit" className="admin-submit-btn font-[Inter]" disabled={loading}>
            {loading ? "Signing In..." : "Sign In as Admin"}
          </button>
        </form>

        <p className="admin-signin-footer font-[Inter]">
          Not an admin?{" "}
          <Link to="/signin" className="footer-link">Go to User Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignIn;