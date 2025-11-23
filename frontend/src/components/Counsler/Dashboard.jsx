import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StudentDetails from "../StudentDetails";

function SendAlerts() {
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchHighRiskStudents = async () => {
    try {
      const res = await axios.get("https://student-risk-dashboard.onrender.com/risk");
      const riskStudents = Array.isArray(res.data) ? res.data : res.data.risk || [];
      const highRisk = riskStudents.filter(
        (student) => student.risk_level?.toUpperCase() === "HIGH"
      );
      setStudents(highRisk);
    } catch (err) {
      console.error("Error fetching high-risk students:", err);
    }
  };

  const handleSendAlerts = async () => {
    try {
      const res = await axios.post("https://student-risk-dashboard.onrender.com/send_alerts");
      setMessage(res.data.message || "Alerts sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send alerts.");
    }
  };

  useEffect(() => {
    fetchHighRiskStudents();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ padding: "30px", fontFamily: "'Poppins', sans-serif" }}
    >
      <h2 style={{ textAlign: "center", color: "#1e88e5", marginBottom: "30px" }}>
        High-Risk Students Dashboard
      </h2>

      {students.length > 0 ? (
        <motion.table
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}
        >
          <thead>
            <tr style={{ background: "#1e88e5", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Student ID</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Attendance Risk</th>
              <th style={{ padding: "12px" }}>Exam Risk</th>
              <th style={{ padding: "12px" }}>Fee Risk</th>
              <th style={{ padding: "12px" }}>Risk Score</th>
              <th style={{ padding: "12px" }}>Risk Level</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ backgroundColor: index % 2 === 0 ? "#f4f4f4" : "#ffffff" }}
              >
                <td style={{ padding: "10px" }}>{s.student_id}</td>
                <td style={{ padding: "10px" }}>{s.name}</td>
                <td style={{ padding: "10px" }}>{s.attendance_risk}</td>
                <td style={{ padding: "10px" }}>{s.exam_risk}</td>
                <td style={{ padding: "10px" }}>{s.fee_risk}</td>
                <td style={{ padding: "10px" }}>{s.risk_score}</td>
                <td
                  style={{
                    padding: "10px",
                    color: s.risk_level.toUpperCase() === "HIGH" ? "#e53935" : "#333",
                    fontWeight: "bold"
                  }}
                >
                  {s.risk_level}
                </td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => setSelectedStudent(s.student_id)}
                    style={{
                      backgroundColor: "#1e88e5",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
          No high-risk students found.
        </p>
      )}

      {selectedStudent && (
        <StudentDetails
          studentId={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={handleSendAlerts}
          style={{
            backgroundColor: "#43a047",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "30px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          Send Email Alerts
        </button>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: "15px", color: "#1e88e5", fontWeight: "bold" }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default SendAlerts;
