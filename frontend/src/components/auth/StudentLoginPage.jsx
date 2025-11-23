import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function StudentLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Aditya Mahale",        // Default value
    rollNo: "CSE2023001",        // Default value
    className: "B.Tech CSE - 3rd Year", // Default value
    password: "student123",      // Default password
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll No is required";
    if (!formData.className.trim()) newErrors.className = "Class is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Fake login success (you can replace with real auth later)
    console.log("Student Login:", formData);
    alert(`Welcome back, ${formData.name.split(" ")[0]}! 🎉`);
    navigate("/student-dashboard");
  };

  /*const mainContentWrapperStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  };*/

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "28rem",
          background: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7, #f97316)",
            color: "white",
            textAlign: "center",
            padding: "3rem 2rem",
          }}
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
          >
            Student Login 🚀
          </motion.h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
            Welcome back to DropoutRaksha
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "2.5rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: errors.name ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "1rem",
                transition: "all 0.2s",
              }}
              placeholder="Enter your full name"
            />
            {errors.name && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}
            >
              Roll Number
            </label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: errors.rollNo ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "1rem",
              }}
              placeholder="e.g. CSE2023001"
            />
            {errors.rollNo && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.rollNo}</p>}
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}
            >
              Class / Course
            </label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: errors.className ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "1rem",
              }}
              placeholder="e.g. B.Tech CSE - 3rd Year"
            />
            {errors.className && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.className}</p>}
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: errors.password ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "1rem",
              }}
              placeholder="Enter your password"
            />
            {errors.password && <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.password}</p>}
             
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              color: "white",
              fontWeight: "700",
              padding: "1rem",
              borderRadius: "9999px",
              border: "none",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            Login as Student
          </motion.button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "1.5rem", background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Not a student?{" "}
            <span
              onClick={() => navigate("/student-dashboard")}
              style={{ color: "#6366f1", fontWeight: 600, cursor: "pointer" }}
            >
              Go back home
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentLoginPage;