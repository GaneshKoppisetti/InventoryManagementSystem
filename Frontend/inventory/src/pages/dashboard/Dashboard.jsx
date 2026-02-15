import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        Welcome to Inventory Management System
      </div>
    </motion.div>
  );
};

export default Dashboard;
