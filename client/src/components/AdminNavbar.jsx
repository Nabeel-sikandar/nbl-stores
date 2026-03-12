// Admin Navbar — admin panel ke liye alag navbar
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  // Logout handler — admin sign in pe redirect
  const handleLogout = () => {
    console.log("Admin logged out");
    navigate("/signin/admin");
  };

  return (
    <nav className="admin-navbar">
      {/* Left — Admin branding */}
      <div className="admin-navbar-brand">
        <span className="admin-logo font-[Playfair_Display]">NBL Stores</span>
        <span className="admin-tag font-[Inter]">ADMIN</span>
      </div>

      {/* Right — Logout */}
      <button onClick={handleLogout} className="admin-logout-btn font-[Inter]">
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;