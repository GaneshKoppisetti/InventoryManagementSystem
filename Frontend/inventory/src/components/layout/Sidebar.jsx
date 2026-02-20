import "./Sidebar.css";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  Settings
} from "lucide-react";
import { useAuth } from "../../context/useContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.permissions?.[0]?.role;

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
      roles: ["Admin", "Manager", "Staff"]
    },
    {
      name: "Roles",
      icon: <Settings size={20} />,
      path: "/roles",
      roles: ["Admin"]
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/users",
      roles: ["Admin"]
    },
    {
      name: "Products",
      icon: <Package size={20} />,
      path: "/products",
      roles: ["Admin", "Manager", "Staff"]
    }
  ];

  const filteredMenu = menuItems.filter(item =>
    item.roles.includes(role)
  );

  return (
    <div className={`sidebar-content ${isOpen ? "expanded" : "collapsed"}`}>
      
      {/* Toggle */}
      <div className="sidebar-header">
        <button
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {filteredMenu.map((item) => {

          // ✅ Proper Active Logic
          const isActive =
            item.path === "/"
              ? (location.pathname === "/" || location.pathname.startsWith("/dashboard"))
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`menu-item ${isActive ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
