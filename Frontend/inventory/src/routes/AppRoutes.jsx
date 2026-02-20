import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteLoader from "../utils/loader/routeLoader";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
// Authentication
import { useAuth } from "../context/useContext";
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Unauthorized = lazy(() => import("../pages/auth/unauthorized"));
const PageNotFound = lazy(() => import("../pages/auth/pagenotfound"));
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

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user?.roles[0])) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
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
              <ProtectedRoute allowedRoles={["Admin", "Staff", "Manager"]}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<ProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}>
              <Dashboard /> </ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}>
              <Dashboard /> </ProtectedRoute>} />
            {/* Views */}
            <Route path="/roles" element={<ProtectedRoute allowedRoles={["Admin"]}>
              <Roles /> </ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={["Admin"]}>
              <Users /> </ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}>
              <Products /> </ProtectedRoute>} />
            {/* Forms */}
            <Route path="/role-form/:id?" element={<ProtectedRoute allowedRoles={["Admin"]}>
              <RoleForm /> </ProtectedRoute>} />
            <Route path="/user-form/:id?" element={<ProtectedRoute allowedRoles={["Admin"]}>
              <UserForm /> </ProtectedRoute>} />
            <Route path="/product-form/:id?" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <ProductForm /> </ProtectedRoute>} />
          </Route>

        </Route>

        <Route path="/unauthorized" element={<Unauthorized />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
