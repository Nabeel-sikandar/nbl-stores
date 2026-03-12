// SignIn Page — connected to backend + Google Login
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./SignIn.css";

const SignIn = () => {
  const { darkMode } = useTheme();
  const { signin, googleLogin } = useAuth();
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
      await signin(formData.email, formData.password);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signin-page ${darkMode ? "signin-dark" : ""}`}>
      <div className="signin-container">
        <h1 className="signin-title font-[Playfair_Display]">Welcome Back</h1>
        <p className="signin-subtitle font-[Inter]">Sign in to your NBL Stores account</p>

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

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label className="input-label font-[Inter]">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="input-field font-[Inter]" required />
          </div>
          <div className="input-group">
            <label className="input-label font-[Inter]">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="input-field font-[Inter]" required />
          </div>
          <button type="submit" className="submit-btn font-[Inter]" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signin-footer font-[Inter]">
          Don't have an account?{" "}
          <Link to="/signup" className="footer-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;