// SignUp Page — connected to backend + Google Login
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./SignUp.css";

const SignUp = () => {
  const { darkMode } = useTheme();
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
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
      await signup(formData.name, formData.email, formData.password, formData.confirmPassword);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signup-page ${darkMode ? "signup-dark" : ""}`}>
      <div className="signup-container">
        <h1 className="signup-title font-[Playfair_Display]">Create Account</h1>
        <p className="signup-subtitle font-[Inter]">Join NBL Stores and start shopping</p>

        {/* Google Login Button */}
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await googleLogin(credentialResponse.credential);
                navigate("/products");
              } catch (err) {
                setError("Google login failed. Try again.");
              }
            }}
            onError={() => setError("Google login failed")}
            theme="outline"
            size="large"
            width="100%"
            text="continue_with"
          />
        </div>

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text font-[Inter]">OR</span>
          <span className="divider-line"></span>
        </div>

        {/* Error message */}
        {error && <p className="auth-error font-[Inter]">{error}</p>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label className="input-label font-[Inter]">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="input-field font-[Inter]" required />
          </div>
          <div className="input-group">
            <label className="input-label font-[Inter]">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="input-field font-[Inter]" required />
          </div>
          <div className="input-group">
            <label className="input-label font-[Inter]">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" className="input-field font-[Inter]" required />
          </div>
          <div className="input-group">
            <label className="input-label font-[Inter]">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className="input-field font-[Inter]" required />
          </div>
          <button type="submit" className="submit-btn font-[Inter]" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="signup-footer font-[Inter]">
          Already have an account?{" "}
          <Link to="/signin" className="footer-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;