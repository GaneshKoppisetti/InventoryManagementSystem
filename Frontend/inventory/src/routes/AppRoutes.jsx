import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteLoader from "../utils/loader/routeLoader";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const RootLayout = lazy(() => new Promise((resolve) => setTimeout(() => resolve(import("../components/layout/Rootlayout")), 2000)));
const MainLayout = lazy(() => import("../components/layout/Mainlayout"));
// Views
const Roles = lazy(() => import("../pages/views/roles"));
const Users = lazy(() => import("../pages/views/users"));
const Products = lazy(() => import("../pages/views/products"));
//Forms
const RoleForm = lazy(() => import("../pages/forms/roleForm"));
const UserForm = lazy(() => import("../pages/forms/userForm"));
const ProductForm = lazy(() => import("../pages/forms/productForm"));

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
            {/* Views */}
            <Route path="/roles" element={<Roles />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            {/* Forms */}
            <Route path="/role-form/:id?" element={<RoleForm />} />
            <Route path="/user-form/:id?" element={<UserForm />} />
            <Route path="/product-form/:id?" element={<ProductForm />} />
          </Route>

        </Route>

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
