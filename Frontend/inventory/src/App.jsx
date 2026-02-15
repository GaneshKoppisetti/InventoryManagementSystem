import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./utils/globalstyles.css";
import Loader from "./utils/loader/Loader";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <Toaster />
      <Loader />
    </BrowserRouter>
  );
}

export default App;
