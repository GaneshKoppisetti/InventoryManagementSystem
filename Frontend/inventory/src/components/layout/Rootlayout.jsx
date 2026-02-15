import TopNavbar from "./TopNavbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="layout-wrapper">
      <TopNavbar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
