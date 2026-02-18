import "./Sidebar.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {LayoutDashboard,Users,Package,ChevronLeft,ChevronRight,Settings} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/"
    },
    {
      name: "Roles",
      icon: <Settings size={20} />,
      path: "/roles"
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/users"
    },
    {
      name: "Products",
      icon: <Package size={20} />,
      path: "/products"
    }
  ];

  return (
    <div className={`sidebar-content ${isOpen ? "expanded" : "collapsed"}`}>
      {/* Toggle */}
      <div className="sidebar-header">
        {/* <span className="sidebar-title">
          {isOpen ? "InventoryMS" : "IM"}
        </span> */}
        <button
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="menu-icon">{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
