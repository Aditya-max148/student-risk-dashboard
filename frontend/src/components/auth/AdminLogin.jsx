import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "admin@dropoutraksha.com",   // Demo admin email
    password: "admin2025",              // Demo password
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

    if (!formData.email.includes("@") || !formData.email.endsWith("dropoutraksha.com")) {
      setErrors({ email: "Use official admin email" });
      return;
    }
    if (formData.password !== "admin2025") {
      setErrors({ password: "Incorrect password" });
      return;
    }

    console.log("Admin Login Success:", formData);
    alert("Welcome back, Admin!");
    navigate("/admin"); // Your admin dashboard route
  };

  return (
    <div style={{
      fontFamily: "Inter, sans-serif",
      background: "linear-gradient(135deg, #1e293b, #334155, #475569)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header - Premium Dark Gradient */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #334155)",
          color: "white",
          textAlign: "center",
          padding: "3rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", top: "20px", right: "20px", opacity: 0.1, fontSize: "6rem" }}
          >
            
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            style={{
              width: "90px",
              height: "90px",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
            }}
          >
            <FiShield size={48} color="white" />
          </motion.div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0.5rem 0" }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
            Super Admin Access Only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "2.5rem 2rem" }}>
          {/* Email */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, marginBottom: "0.5rem", color: "#1f2937" }}>
              <FiMail size={20} /> Admin Email
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
                backgroundColor: errors.email ? "#fef2f2" : "#f9fafb",
                transition: "all 0.2s",
              }}
              placeholder="admin@dropoutraksha.com"
            />
            {errors.email && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.4rem" }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, marginBottom: "0.5rem", color: "#1f2937" }}>
              <FiLock size={20} /> Master Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "1rem 3.2rem 1rem 1rem",
                  borderRadius: "0.75rem",
                  border: errors.password ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: "1rem",
                  backgroundColor: errors.password ? "#fef2f2" : "#f9fafb",
                }}
                placeholder="Enter master password"
              />
              <button
                type="button"
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
                {showPassword ? <FiEyeOff size={22} color="#6b7280" /> : <FiEye size={22} color="#6b7280" />}
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
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: 700,
              padding: "1.1rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(220, 38, 38, 0.4)",
            }}
          >
            Access Admin Panel
          </motion.button>

          {/* Back Links */}
          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.95rem", color: "#6b7280" }}>
            <span
              onClick={() => navigate("/counselor-login")}
              style={{ cursor: "pointer", color: "#6366f1", fontWeight: 600 }}
            >
              Counselor Login
            </span>
            {" • "}
            <span
              onClick={() => navigate("/student-login")}
              style={{ cursor: "pointer", color: "#10b981", fontWeight: 600 }}
            >
              Student Login
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;