import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function CounselorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "priya.counselor@college.edu.in",    // Demo email
    password: "counselor123",                   // Demo password
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple demo validation
    if (!formData.email.includes("@")) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }
    if (formData.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    // Success → Redirect to Counselor Dashboard
    console.log("Counselor Login:", formData);
    alert(`Welcome back, Counselor!`);
    navigate("/dashboard"); // Change to your counselor dashboard route
  };

  return (
    <div style={{
      fontFamily: "Inter, sans-serif",
      background: "linear-gradient(135deg, #6366f1, #a855f7, #f97316)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          color: "white",
          textAlign: "center",
          padding: "3rem 2rem",
        }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}
          >
          </motion.div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, margin: "0.5rem 0" }}>
            Counselor Login
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.95 }}>
            Access your dashboard to support students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "2.5rem 2rem" }}>
          {/* Email */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>
              <FiMail size={20} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: errors.email ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "1rem",
                transition: "all 0.2s",
              }}
              placeholder="counselor@college.edu.in"
            />
            {errors.email && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.4rem" }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>
              <FiLock size={20} /> Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "1rem 3rem 1rem 1rem",
                  borderRadius: "0.75rem",
                  border: errors.password ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: "1rem",
                }}
                placeholder="Enter your password"
              />
              <button
                type="  "
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FiEyeOff size={22} color="#9ca3af" /> : <FiEye size={22} color="#9ca3af" />}
              </button>
            </div>
            {errors.password && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.4rem" }}>{errors.password}</p>}
          </div>

           

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 700,
              padding: "1.1rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            Login as Counselor
          </motion.button>

          {/* Links */}
          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.95rem", color: "#6b7280" }}>
            <span
              onClick={() => alert("Password reset link sent! (Demo mode)")}
              style={{ cursor: "pointer", color: "#6366f1", fontWeight: 600 }}
            >
              Forgot Password?
            </span>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.95rem", color: "#6b7280" }}>
            New counselor?{" "}
            <span
              onClick={() => navigate("/counselor-signup")}
              style={{ color: "#6366f1", fontWeight: 600, cursor: "pointer" }}
            >
              Create account
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CounselorLogin;