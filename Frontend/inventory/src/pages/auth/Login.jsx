import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import validate from "../../utils/validation/validator";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import {useAuth} from "../../context/useContext";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    let validationData = [
      { name: "Email", value: formData.email, required: true, type: "email", id: "email" },
      { name: "Password", value: formData.password, required: true, type: "password", id: "password" }
    ];
    try {
      let validResponse = validate(validationData);
      if (!validResponse.isValid) {
        showToast(validResponse.message, "error");
        return;
      }
      let Resp= await api.post("/users/loginUser", formData);
      showToast(Resp.data.message, "success");
      login(Resp.data);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      showToast(message, "error");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="login-container">

      <div
        className="login-card"
      >
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">
          Login to continue to InventoryMS
        </p>
        <div className="login-form">

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              id="email"
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              id="password"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            onClick={handleSubmit}
          >
            Login
          </button>

        </div>

        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
