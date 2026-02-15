import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteLoader from "../utils/loader/routeLoader";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const RootLayout = lazy(() => new Promise((resolve) => setTimeout(() => resolve(import("../components/layout/Rootlayout")), 2000)));
const MainLayout = lazy(() => import("../components/layout/Mainlayout"));
const Users = lazy(() => import("../pages/views/users"));
const Products = lazy(() => import("../pages/views/products"));

const ProtectedRoute = ({ children }) => {
  const { token } = localStorage;
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>

        {/* ROOT LAYOUT (TopNavbar always visible) */}
        <Route element={<RootLayout />}>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
          </Route>

        </Route>

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
