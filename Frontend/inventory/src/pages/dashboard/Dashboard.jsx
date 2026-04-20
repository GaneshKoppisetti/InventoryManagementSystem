import "./Dashboard.css";
import { motion } from "framer-motion";
import { Package, CheckCircle, AlertTriangle, Layers } from "lucide-react";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { useEffect, useState } from "react";
import api from "../../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    showLoader();
    // Fetch products data
    const fetchData = async () => {
      try {
        const response = await api.get("/products/getProducts");
        console.log("Products data:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products data:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");

      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStock = products.filter(p => p.quantity < 50).length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package size={28} />,
      color: "blue"
    },
    {
      title: "Active Products",
      value: activeProducts,
      icon: <CheckCircle size={28} />,
      color: "green"
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: <AlertTriangle size={28} />,
      color: "orange"
    },
    {
      title: "Total Quantity",
      value: totalQuantity,
      icon: <Layers size={28} />,
      color: "purple"
    }
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title"> Overview Of Products</h2>

      <div className="stats-grid">
        {stats.reduce((rows, stat, index) => {
          if (index % 2 === 0) {
            rows.push([stat]);
          } else {
            rows[rows.length - 1].push(stat);
          }
          return rows;
        }, []).map((row, rowIndex) => (
          <div className="stats-row" key={rowIndex}>
            {row.map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`stat-card ${stat.color}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
