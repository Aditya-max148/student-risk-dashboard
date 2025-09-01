import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import RiskDashboard from "./components/RiskDashboard";
import StudentDetails from "./components/StudentDetails";
import Navbar from "./components/Navbar";
import axios from "axios";
import SchoolDashboard from "./components/SchoolDashboard";
import Filters from "./components/Filters";
import NotificationPanel from "./components/NotificationPanel";

// NEW: Separated the Dashboard UI into its own page

function DashboardPage() {
  const navigate = useNavigate(); // ✅ FIX: useNavigate is now inside DashboardPage
  const handleFinalSubmit = () => navigate("/reports");

  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    highRiskCount: 0,
    attendanceRate: 0,
    feePaymentRate: 0,
  });


  const fetchHighRiskStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/risk");
      const studentsData = Array.isArray(res.data)
        ? res.data
        : res.data.risk || [];

      // Total students
      const totalStudents = studentsData.length;

      // High-risk students
      const highRisk = studentsData.filter(
        (student) => student.risk_level?.toUpperCase() === "HIGH"
      );



      // Attendance Risk %
      const attendanceRiskCount = studentsData.filter(
        (s) => s.attendance_risk > 0
      ).length;
      const attendanceRate =
        totalStudents > 0
          ? (((totalStudents - attendanceRiskCount) / totalStudents) * 100).toFixed(2)
          : 0;

      // Fee Payment Rate %
      const feeRiskCount = studentsData.filter((s) => s.fee_risk > 0).length;
      const feePaymentRate =
        totalStudents > 0
          ? (((totalStudents - feeRiskCount) / totalStudents) * 100).toFixed(2)
          : 0;

      // Update State
      setStudents(studentsData);
      setStats({
        totalStudents,
        highRiskCount: highRisk.length,
        attendanceRate,
        feePaymentRate,
      });
    } catch (err) {
      console.error("Error fetching risk data:", err);
    }
  };

  const highRisk = students.filter(
    (s) => s.risk_level?.toUpperCase() === "HIGH"
  );
  const mediumRisk = students.filter(
    (s) => s.risk_level?.toUpperCase() === "MEDIUM"
  );


  useEffect(() => {
    fetchHighRiskStudents();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh", padding: "20px" }}>
      {/* Top Navigation */}
      <Navbar/>

      {/* Dashboard Overview */}
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Dashboard Overview</h2>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>Manage your educational data and monitor key metrics</p>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
        {[
          { title: "Total Students", value: stats.totalStudents, change: "↑ 12% from last month" },
          { title: "Attendance Rate", value: `${stats.attendanceRate}%`, change: "↑ 1.2% from last week" },
          { title: "Fees Collected", value: `${stats.feePaymentRate}%`, change: "↓ 5% from last month" },
          { title: "Dropout Student", value: stats.highRiskCount, change: "↓ Near By Dropout" },
        ].map((card, idx) => (
          <div key={idx} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>{card.title}</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}>{card.value}</div>
            <div style={{ fontSize: "12px", color: card.change.includes("↓") ? "red" : "green" }}>{card.change}</div>
          </div>
        ))}
      </div>

      {/* Data Upload & Analytics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* Upload Center */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>Data Upload Center</h3>
          {[
            { label: "Attendance Data", desc: "Import daily attendance records", dataType: "attendance" },
            { label: "Exam Data", desc: "Import Exam Marks records", dataType: "exam_results" },
            { label: "Fee Records", desc: "Upload payment and fee collection data", dataType: "fee_payments" },
          ].map((item, idx) => (
            <div key={idx} style={{ border: "2px dashed #d1d5db", padding: "15px", borderRadius: "8px", marginBottom: "10px", textAlign: "center" }}>
              <div style={{ fontWeight: "600", marginBottom: "5px" }}>{item.label}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>{item.desc}</div>
              <UploadForm dataType={item.dataType} />
            </div>
          ))}
          <div style={{
            display: "flex",
            justifyContent: "center", // Horizontal center
            alignItems: "center",     // Vertical center
            marginTop: "20px",
          }}>
            <button
              onClick={handleFinalSubmit}
              style={{
                padding: "12px 28px",
                fontSize: "16px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #28a745, #218838)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #34d058, #28a745)";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #28a745, #218838)";
                e.target.style.transform = "scale(1)";
              }}
            >
              🚀 Generate Risk Dashboard
            </button>

          </div>

          <div style={{ marginTop: "15px" }}>
            <div style={{ fontSize: "14px", marginBottom: "5px" }}>Upload Progress</div>
            <div style={{ backgroundColor: "#e5e7eb", borderRadius: "4px", height: "8px" }}>
              <div style={{ backgroundColor: "#3b82f6", width: "0%", height: "100%", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Risk Overview
          </h3>

          {/* High Risk Students */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ marginBottom: "10px", color: "#ef4444" }}>
              🔴 High Risk Students
            </h4>
            {highRisk.length === 0 ? (
              <p style={{ color: "#9ca3af" }}>No high-risk students</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "8px" }}>ID</th>
                    <th style={{ padding: "8px" }}>Name</th>
                    <th style={{ padding: "8px" }}>Dropout %</th>
                  </tr>
                </thead>
                <tbody>
                  {highRisk.map((student) => (
                    <tr
                      key={student.student_id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "8px" }}>{student.student_id}</td>
                      <td style={{ padding: "8px" }}>{student.name}</td>
                      <td style={{ padding: "8px", color: "#ef4444" }}>
                        {(student.risk_score * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Medium Risk Students */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ marginBottom: "10px", color: "#f59e0b" }}>
              🟠 Medium Risk Students
            </h4>
            {mediumRisk.length === 0 ? (
              <p style={{ color: "#9ca3af" }}>No medium-risk students</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "8px" }}>ID</th>
                    <th style={{ padding: "8px" }}>Name</th>
                    <th style={{ padding: "8px" }}>Dropout %</th>
                  </tr>
                </thead>
                <tbody>
                  {mediumRisk.map((student) => (
                    <tr
                      key={student.student_id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "8px" }}>{student.student_id}</td>
                      <td style={{ padding: "8px" }}>{student.name}</td>
                      <td style={{ padding: "8px", color: "#f59e0b" }}>
                        {(student.risk_score * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>


          {/* Recent Activity */}
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>Recent Activity</h3>
            {[
              { text: "Student records uploaded successfully", time: "2 hours ago" },
              { text: "New student enrollment processed", time: "4 hours ago" },
              { text: "Attendance data synchronized", time: "8 hours ago" },
            ].map((activity, idx) => (
              <div key={idx} style={{ padding: "10px 0", borderBottom: idx !== 2 ? "1px solid #e5e7eb" : "none" }}>
                <div style={{ fontWeight: "500" }}>{activity.text}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{activity.time}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "20px" }}>
            © 2025 EduDash. All rights reserved. | Privacy | Terms | Support
          </div>
        </div>
      </div>
    </div>
  );
}

// Main AppContent
function AppContent() {
  const navigate = useNavigate();

  const handleSendAlerts = () => navigate("/sent-alerts");



  return (
    <div style={{ padding: "20px" }}>
      <Routes>
        <Route path="/" element={
          <>
            <DashboardPage />
            {/*<Navbar />
            <h1 style={{ textAlign: "center" }}>Student Risk Dashboard</h1>
            <UploadForm dataType="attendance" />
            <UploadForm dataType="exam_results" />
            <UploadForm dataType="fee_payments" />
            <hr style={{ margin: "30px 0" }} />*/}



            <button
              onClick={handleSendAlerts}
              style={{ padding: "10px 20px", margin: "20px", fontSize: "16px", backgroundColor: "#4128a7", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Send Alert
            </button>
          </>
        } />
        <Route path="/reports" element={<RiskDashboard />} />
        <Route path="/school" element={<SchoolDashboard />} />
        <Route path="/filters" element={<Filters/>} />
        <Route path="/notification" element={<NotificationPanel/>} />
        <Route path="/student-details" element={<StudentDetails />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
