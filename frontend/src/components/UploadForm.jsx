import React, { useState } from "react";
import axios from "axios";

function UploadForm({ dataType }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
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

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        width: "320px",
        margin: "15px auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "15px",
        }}
      >
        Upload {dataType}
      </h3>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{
          display: "block",
          margin: "0 auto 15px auto",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      />

      <button
        onClick={handleUpload}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        Upload
      </button>

      {message && (
        <p
          style={{
            marginTop: "12px",
            color: message.includes("failed") ? "red" : "green",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadForm;
