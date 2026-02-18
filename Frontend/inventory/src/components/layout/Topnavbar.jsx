import "./TopNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoged, setisLoged] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
    setisLoged(localStorage.getItem("token") ? true : false);
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
        <Link to="/" className="topnav-logo">
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
              <div className="nav-user">
                <User size={18} />
                <span>{user?.username}</span>
              </div>

              <button onClick={handleLogout} title="Logout" className="logout-btn">
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
              <button onClick={handleLogout} className="logout-btn">
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
