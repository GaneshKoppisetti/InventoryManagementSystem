import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-section">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
