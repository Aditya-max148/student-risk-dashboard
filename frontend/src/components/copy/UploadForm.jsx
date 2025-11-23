import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import motion for animations

function UploadForm({ dataType }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `https://student-risk-dashboard.onrender.com//upload/${dataType}`,
        formData
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Upload failed");
    }
  };

  // Animation variants for the card and button
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const fileInputVariants = {
    hover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        border: "1px solid #e0e7ff", // Lighter, friendlier border color
        borderRadius: "16px", // More rounded corners
        padding: "24px",
        backgroundColor: "#ffffff", // Pure white background
        width: "min(380px, 95%)", // Responsive width
        margin: "15px auto",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)", // Softer, more pronounced shadow
        textAlign: "center",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#374151",
          marginBottom: "15px",
        }}
      >
        Upload {dataType} 📝
      </h3>

      <motion.input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{
          display: "block",
          margin: "0 auto 20px auto",
          padding: "12px",
          border: `2px dashed ${file ? "#10B981" : "#818CF8"}`, // Green if file selected, blue otherwise
          backgroundColor: file ? "#D1FAE5" : "#EEF2FF",
          borderRadius: "10px",
          cursor: "pointer",
          width: "100%",
          transition: "all 0.3s ease",
        }}
        variants={fileInputVariants}
        whileHover="hover"
      />

      <motion.button
        onClick={handleUpload}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        style={{
          backgroundColor: "#4F46E5", // A vibrant indigo color
          color: "white",
          padding: "12px 25px",
          border: "none",
          borderRadius: "10px", // More rounded button
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px",
          width: "100%",
          boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)", // Shadow to match button color
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        🚀 Upload
      </motion.button>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "20px",
            color: message.includes("failed") ? "#EF4444" : "#10B981", // Red for fail, green for success
            fontWeight: "600",
            fontSize: "15px",
            backgroundColor: message.includes("failed") ? "#FEE2E2" : "#D1FAE5", // Light red/green background
            padding: "12px",
            borderRadius: "8px",
            border: `1px solid ${message.includes("failed") ? "#EF4444" : "#10B981"}`,
          }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

export default UploadForm;