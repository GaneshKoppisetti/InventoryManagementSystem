import "./Signup.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import validate from "../../utils/validation/validator";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
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
      { name: "Full Name", value: formData.username, type: "text", id: "username" },
      { name: "Email", value: formData.email, type: "email", id: "email" },
      { name: "Password", value: formData.password, type: "password", id: "password" },
      { name: "Confirm Password", value: formData.confirmPassword, type: "password", id: "confirmPassword" }
    ];
    try {
      let validResponse = validate(validationData);
      if (!validResponse.isValid) {
        hideLoader();
        showToast(validResponse.message, "error");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
      }
      await api.post("/users/createuser", formData);
      showToast("Signup successful! Please login.", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Signup error:", err);
      showToast("Signup failed. Try again.", "error");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="signup-container">
      <div
        className="signup-card"
      >
        <h2 className="signup-title">Create Account 🚀</h2>
        <p className="signup-subtitle">
          Join InventoryMS to manage your products
        </p>

        <div className="signup-form">

          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              required
              value={formData.username}
              onChange={handleChange}
              id="username"
            />
          </div>

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
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

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              id="confirmPassword"
            />
          </div>

          <button
            type="button"
            className="signup-button"
            onClick={handleSubmit}
          >
            Sign Up
          </button>

        </div>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
