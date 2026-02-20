import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import "./unauthorized.css"

const Unauthorized = () => {
  return (
    <div className="unauth-container">
      <motion.div
        className="unauth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="icon-wrapper"
        >
          <ShieldAlert size={60} />
        </motion.div>

        <h1>401 - Unauthorized</h1>
        <p>
          You don’t have permission to access this page.
          <br />
          Please go to dashboard.
        </p>

        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="unauth-btn"
          >
            Go to Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
