import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import "./pagenotfound.css";

const PageNotFound = () => {
  return (
    <div className="notfound-container">
      <motion.div
        className="notfound-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="notfound-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <SearchX size={60} />
        </motion.div>

        <motion.h1
          className="notfound-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>

        <p className="notfound-text">
          Oops! The page you’re looking for doesn’t exist.
          <br />
          It might have been moved or deleted.
        </p>

        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="notfound-btn"
          >
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default PageNotFound;
