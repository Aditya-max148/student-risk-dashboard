import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import axios from "axios";

const NotificationPanel = () => {
  const [students, setStudents] = useState([]);
  const [resolvedStudents, setResolvedStudents] = useState([]);

  const markResolved = (studentId) => {
    setResolvedStudents((prev) => [...prev, studentId]);
  };

  const fetchRiskData = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://student-risk-dashboard.onrender.com/risk"
      );
      const studentsData = Array.isArray(res.data)
        ? res.data
        : res.data.risk || [];

      const highRisk = studentsData.filter(
        (s) => s.risk_level?.toUpperCase() === "HIGH"
      );

      setStudents(highRisk);
    } catch (err) {
      console.error("Error fetching risk data:", err);
    }
  }, []);

  useEffect(() => {
    fetchRiskData();
  }, [fetchRiskData]);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get(
        "https://student-risk-dashboard.onrender.com/generate-report",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dropout_probability_report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };

  return (
    <div style={{ backgroundColor: "#ffff",boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minHeight: "100vh", fontFamily: "Arial, sans-serif", color: "#f3f4f6" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "20px" }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ fontSize: "32px", fontWeight: "bold", color: "#facc15", marginBottom: "30px", textAlign: "center" }}
        >
          🎯 Notifications / Alerts Panel
        </motion.h1>

        {/* Notification Cards */}
        <div style={{ display: "grid",boxShadow: '0 4px 12px rgba(0,0,0,0.1)', gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {students.length > 0 ? (
            students.map((student, index) => {
              const isResolved = resolvedStudents.includes(student.student_id);

              return (
                <motion.div
                  key={student.student_id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    backgroundColor: isResolved ? "#82AFA2" : "#D98E8E",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    color: "#f3f4f6",
                  }}
                >
                  <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                    {student.name || `Student ${index + 1}`}
                  </h3>
                  <p>
                    Status: <span style={{ fontWeight: "bold" }}>High Risk</span>
                  </p>
                  <p>Attendance Risk: {(student.attendance_risk * 100).toFixed(2)}%</p>
                  <p>Exam Risk: {(student.exam_risk * 100).toFixed(2)}%</p>
                  <p>Fee Risk: {(student.fee_risk * 100).toFixed(2)}%</p>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                    <button
                      onClick={() =>
                        alert(`Message sent to ${student.name} ${student.parent_email || "Parent"}`)
                      }
                      style={{
                        backgroundColor: "#facc15",
                        color: "#FFFFFF",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      📧 Send Message 
                    </button>

                    <button
                      onClick={() =>
                        alert(`Calling to ${student.name} ${student.parent_email || "Parent"}`)
                      }
                      style={{
                        backgroundColor: "red",
                        color: "#FFFFFF",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                     📞 Call Parent 
                    </button>
                    <button
                      onClick={() =>
                        alert(`Calling to ${student.name} ${student.parent_email || "Parent"}`)
                      }
                      style={{
                        
                        backgroundColor: "red",
                        color: "#FFFFFF",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                    ➡ Forwad Counsler 
                    </button>

                    <button
                      onClick={() => markResolved(student.student_id)}
                      style={{
                        backgroundColor: isResolved ? "#10b981" : "#2563eb",
                        color: "#f3f4f6",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {isResolved ? "✅ Resolved" : "Mark Resolved"}
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#94a3b8" }}>
              No high-risk students right now.
            </p>
          )}
        </div>

        {/* Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "black", fontWeight: "700", marginBottom: "20px" }}>
            📝 Generate Dropout Probability Report
          </h2>

          <button
            onClick={handleGenerateReport}
            style={{
              backgroundColor: "#3b82f6",
              color: "#f3f4f6",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
          >
            Generate Report
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPanel;
