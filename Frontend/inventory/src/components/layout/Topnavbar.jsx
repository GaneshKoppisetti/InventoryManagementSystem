import "./TopNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import { useAuth } from "../../context/useContext";
const TopNavbar = () => {
  const { user ,logout} = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoged, setisLoged] = useState(false);

  const handleLogOut = async () => {
    try {
      showLoader();
      const resp = await api.post('users/logOutUser',{});
      showToast(resp.data.message, "success");
      setisLoged(false);
      logout();
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      showToast(message, "error");
    } finally {
      hideLoader();
    }
  };
  useEffect(() => {
    setisLoged(user ? true : false);
  });


  return (
    <motion.header
      className="topnav"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="topnav-inner">

        {/* Logo */}
        <Link to="/" className="topnav-logo" title="Inventory Management System">
          <img src="/src/utils/logo.png" alt="IMS Logo" className="ims-logo-img" />
          {/* <span className="logo-text">Inventory<span>MS</span></span> */}
        </Link>

        {/* Desktop Links */}
        <nav className="topnav-links">
          {!isLoged ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-button">Sign Up</Link>
            </>
          ) : (
            <>
              <div className="nav-user-wrapper">
                <div className="nav-user-trigger" title="View Profile">
                  <User size={18} />
                  <span className="nav-username">{user?.username}</span>
                </div>

                <div className="nav-user-dropdown">
                  <div className="dropdown-item">
                    <span className="label">Email : </span>
                    <span className="value">{user?.email}</span>
                  </div>

                  <div className="dropdown-item">
                    <span className="label">Role : </span>
                    <span className="value">
                      {user?.role || user?.roles?.[0]}
                    </span>
                  </div>
                </div>
              </div>


              <button onClick={handleLogOut} title="Logout" className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={22} />
        </button>

      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="mobile-menu">
          {!isLoged ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <>
              <span className="mobile-user">{user?.username}</span>
              <button onClick={handleLogOut} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </motion.header>
  );
};

export default TopNavbar;
