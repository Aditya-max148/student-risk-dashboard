import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDetails from "./StudentDetails";

function SendAlerts() {
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

   

  // ✅ Fetch high-risk students
  const fetchHighRiskStudents = async () => {
    try {
      const res = await axios.get("https://student-risk-dashboard.onrender.com/risk");
      const riskStudents = Array.isArray(res.data)
        ? res.data
        : res.data.risk || [];

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
    <div>
     
    <div style={{ margin: "20px", }}>
      <h3>High-Risk Students</h3>

      {students.length > 0 ? (
        <table
          border="1"
          cellPadding="8"
          style={{ marginTop: "10px", borderCollapse: "collapse", marginBottom: '20px' }}
        >
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Attendance Risk</th>
              <th>Exam Risk</th>
              <th>Fee Risk</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={index}>
                <td>{s.student_id}</td>
                <td>{s.name}</td>
                <td>{s.attendance_risk}</td>
                <td>{s.exam_risk}</td>
                <td>{s.fee_risk}</td>
                <td>{s.risk_score}</td>

                <td
                  style={{
                    color: s.risk_level?.toUpperCase() === "HIGH" ? "red" : "black",
                    fontWeight: "bold",
                  }}
                >
                  {s.risk_level}
                </td>
                <td>
                  <button onClick={() => setSelectedStudent(s.student_id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No high-risk students found.</p>
      )}

      {/* ✅ Render Details Outside the Table */}
      {selectedStudent && (
        <StudentDetails
          studentId={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <div>
        <button
          onClick={handleSendAlerts}
          style={{
            marginTop: "40px",
            background: "#e63946",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send Email Alerts
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
    </div>
  );
}

export default SendAlerts;
