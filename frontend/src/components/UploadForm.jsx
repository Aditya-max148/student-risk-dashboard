// UploadForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, FileText } from "lucide-react"; // Optional icons

function UploadForm() {
  const [fileEntries, setFileEntries] = useState([
    { id: Date.now(), className: "", date: "", type: "attendance", file: null },
  ]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const addNewFileEntry = () => {
    setFileEntries([
      ...fileEntries,
      { id: Date.now(), className: "", date: "", type: "attendance", file: null },
    ]);
  };

  const removeFileEntry = (id) => {
    setFileEntries(fileEntries.filter((entry) => entry.id !== id));
  };

  const updateFileEntry = (id, field, value) => {
    setFileEntries(
      fileEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleFileChange = (id, file) => {
    updateFileEntry(id, "file", file);
  };

  const handleUploadAll = async () => {
    // Validate
    const invalid = fileEntries.some(
      (e) => !e.className || !e.date || !e.file
    );

    if (invalid) {
      setMessage("Please fill Class, Date, and select a file for each entry!");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();

    fileEntries.forEach((entry, index) => {
      formData.append(`files[${index}][file]`, entry.file);
      formData.append(`files[${index}][className]`, entry.className);
      formData.append(`files[${index}][date]`, entry.date);
      formData.append(`files[${index}][type]`, entry.type);
    });

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/upload/batch", // Update your backend route
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(`Successfully uploaded ${fileEntries.length} file(s)!`);
      // Reset form
      setFileEntries([
        { id: Date.now(), className: "", date: "", type: "attendance", file: null },
      ]);
    } catch (err) {
      setMessage(err.response?.data?.error || "Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const fileTypes = [
    { value: "attendance", label: "Attendance", color: "#10b981" },
    { value: "exam", label: "Exam/Grades", color: "#8b5cf6" },
    { value: "fees", label: "Fees/Finance", color: "#f59e0b" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        maxWidth: "680px",
        margin: "40px auto",
        padding: "32px",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: 800, color: "#1e293b" }}>
        Upload School Records
      </h2>
      <p style={{ textAlign: "center", color: "#64748b", marginBottom: "32px" }}>
        Add one or more files with Class, Date & Type
      </p>

      <div style={{ marginBottom: "24px" }}>
        {fileEntries.map((entry, index) => {
          const selectedType = fileTypes.find(t => t.value === entry.type);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                marginBottom: "20px",
                padding: "24px",
                border: `2px dashed ${entry.file ? selectedType.color : "#cbd5e1"}`,
                borderRadius: "16px",
                backgroundColor: entry.file ? `${selectedType.color}10` : "#f8fafc",
                position: "relative",
              }}
            >
              {fileEntries.length > 1 && (
                <button
                  onClick={() => removeFileEntry(entry.id)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(239,68,68,0.1)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={18} color="#ef4444" />
                </button>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Class (e.g. 10A, Grade 8)"
                  value={entry.className}
                  onChange={(e) => updateFileEntry(entry.id, "className", e.target.value)}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateFileEntry(entry.id, "date", e.target.value)}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <select
                value={entry.type}
                onChange={(e) => updateFileEntry(entry.id, "type", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                }}
              >
                {fileTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => handleFileChange(entry.id, e.target.files?.[0] || null)}
                style={{ width: "100%", padding: "8px 0" }}
              />

              {entry.file && (
                <p style={{ color: selectedType.color, margin: "12px 0 0", fontSize: "14px", fontWeight: 500 }}>
                  <FileText size={16} style={{ display: "inline", marginRight: "6px" }} />
                  {entry.file.name}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={addNewFileEntry}
          style={{
            flex: 1,
            padding: "14px",
            background: "#e0e7ff",
            color: "#4338ca",
            border: "none",
            borderRadius: "12px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Plus size={20} /> Add Another File
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUploadAll}
        disabled={uploading}
        style={{
          width: "100%",
          padding: "18px",
          background: uploading
            ? "#94a3b8"
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: 700,
          cursor: uploading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Upload size={22} />
        {uploading ? `Uploading ${fileEntries.length} file(s)...` : `Upload ${fileEntries.length} File(s)`}
      </motion.button>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: message.includes("success") || message.includes("uploaded")
              ? "#d1fae5"
              : "#fee2e2",
            color: message.includes("success") || message.includes("uploaded")
              ? "#065f46"
              : "#991b1b",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}

export default UploadForm;