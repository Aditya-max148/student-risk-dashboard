import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion for animations
import UploadForm from "./components/UploadForm";
import RiskDashboard from "./components/RiskDashboard";
import StudentDetails from "./components/StudentDetails";
import Navbar from "./components/Navbar";
import axios from "axios";
import SchoolDashboard from "./components/SchoolDashboard";
import NotificationPanel from "./components/NotificationPanel";
import Chatbot from "./components/Student/Chatbot";
import GamificationPage from "./components/Student/GamificationPage";
import LandingPage from "./components/LandingPage";
import StudentDashboard from "./components/Student/StudentDashboard";
import StudentLoginPage from "./components/auth/StudentLoginPage";
import MotivationPage from "./components/Student/MotivationPage";
import TelegramBotInteractionPage from "./components/Student/TelegramBotInteractionPage";
import CounselorLogin from "./components/auth/CounselorLogin";
import AdminLogin from "./components/auth/AdminLogin";
import AdminDataDashboard from "./components/admin/AdminDataDashboard";
import ClassDepartmentDashboard from "./components/admin/ClassDepartmentDashboard";
import CounselorManagement from "./components/admin/CounselorManagement";
import ReportsDashboard from "./components/admin/ReportsDashboard";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Animation variants for list items
const listVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function DashboardPage() {
  const navigate = useNavigate();
  const handleFinalSubmit = () => navigate("/reports");

  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    highRiskCount: 0,
    attendanceRate: 0,
    feePaymentRate: 0,
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchRiskData = async () => {
    try {
      const res = await axios.get("https://student-risk-dashboard.onrender.com/risk");
      const studentsData = Array.isArray(res.data) ? res.data : res.data.risk || [];
      const totalStudents = studentsData.length;
      const highRisk = studentsData.filter((student) => student.risk_level?.toUpperCase() === "HIGH");
      const attendanceRiskCount = studentsData.filter((s) => s.attendance_risk > 0).length;
      const attendanceRate = totalStudents > 0 ? (((totalStudents - attendanceRiskCount) / totalStudents) * 100).toFixed(2) : 0;
      const feeRiskCount = studentsData.filter((s) => s.fee_risk > 0).length;
      const feePaymentRate = totalStudents > 0 ? (((totalStudents - feeRiskCount) / totalStudents) * 100).toFixed(2) : 0;
      setStudents(studentsData);
      setStats({ totalStudents, highRiskCount: highRisk.length, attendanceRate, feePaymentRate });
    } catch (err) {
      console.error("Error fetching risk data:", err);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  const highRisk = students.filter((s) => s.risk_level?.toUpperCase() === "HIGH");
  const mediumRisk = students.filter((s) => s.risk_level?.toUpperCase() === "MEDIUM");

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const gridColsStats = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)";
  const gridColsMain = isMobile ? "1fr" : "1fr 1fr";

  // Helper function for color-coding stats cards
  const getStatColor = (title) => {
    switch (title) {
      case "Total Students": return "#1D4ED8"; // Blue-700
      case "Attendance Rate": return "#059669"; // Green-600
      case "Fees Collected": return "#F59E0B"; // Amber-500
      case "Dropout Student": return "#DC2626"; // Red-600
      default: return "#4B5563";
    }
  };

  const statsCards = [
    { title: "Total Students", value: stats.totalStudents, change: "↑ 12% from last month" },
    { title: "Attendance Rate", value: `${stats.attendanceRate}%`, change: "↑ 1.2% from last week" },
    { title: "Fees Collected", value: `${stats.feePaymentRate}%`, change: "↓ 5% from last month" },
    { title: "Dropout Student", value: stats.highRiskCount, change: "↓ Near By Dropout" },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh", padding: isMobile ? "20px" : "32px" }}>
      <Navbar />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}
      >
        Dashboard Overview 📊
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ color: "#6b7280", marginBottom: "32px", fontSize: "16px" }}
      >
        Manage your educational data and monitor key metrics.
      </motion.p>

      {/* Stats Cards */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: gridColsStats,
          gap: "24px",
          marginBottom: "32px"
        }}
      >
        {statsCards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={listVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              borderLeft: `5px solid ${getStatColor(card.title)}`,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "600", marginBottom: "8px" }}>{card.title}</div>
            <div style={{ fontSize: isMobile ? "28px" : "36px", fontWeight: "bold", color: "#111827", margin: "4px 0" }}>{card.value}</div>
            <div style={{ fontSize: "14px", color: card.change.includes("↓") ? "#EF4444" : "#10B981" }}>{card.change}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Data Upload & Analytics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: gridColsMain,
        gap: "24px",
        marginBottom: "32px"
      }}>
        {/* Upload Center */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
        >
          <motion.h3 variants={listVariants} style={{ fontSize: "20px", fontWeight: "600", color: "#374151", marginBottom: "20px" }}>
            Data Upload Center 📂
          </motion.h3>
          {[
            { label: "Attendance Data", desc: "Import daily attendance records", dataType: "attendance" },
            { label: "Exam Data", desc: "Import Exam Marks records", dataType: "exam_results" },
            { label: "Fee Records", desc: "Upload payment and fee collection data", dataType: "fee_payments" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={listVariants}
              style={{
                marginBottom: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#f9fafb"
              }}
              whileHover={{ backgroundColor: "#f3f4f6" }}
            >
              <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "15px" }}>{item.desc}</div>
              <UploadForm dataType={item.dataType} />
            </motion.div>
          ))}
          <motion.button
            onClick={handleFinalSubmit}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "600",
              background: "linear-gradient(135deg, #10B981, #059669)", // Green gradient
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            🚀 Generate Risk Dashboard
          </motion.button>
        </motion.div>

        {/* Analytics Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
          }}
        >
          <motion.h3 variants={listVariants} style={{ fontSize: "20px", fontWeight: "600", color: "#374151", marginBottom: "24px" }}>
            Risk Overview 🚨
          </motion.h3>

          {/* High Risk */}
          <motion.div variants={listVariants} style={{ border: "1px solid #FEE2E2", borderRadius: "12px", padding: "24px", marginBottom: "24px", backgroundColor: "#FEF2F2" }}>
            <h4 style={{ marginBottom: "12px", color: "#EF4444", fontWeight: "600" }}>High Risk Students</h4>
            {highRisk.length === 0 ? (
              <p style={{ color: "#9CA3AF" }}>No high-risk students detected.</p>
            ) : (
              <motion.table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }} initial="hidden" animate="visible" variants={sectionVariants}>
                <thead>
                  <tr style={{ textAlign: "left", fontSize: "14px", color: "#6B7280" }}>
                    <th style={{ padding: "8px 0" }}>ID</th>
                    <th style={{ padding: "8px 0" }}>Name</th>
                    <th style={{ padding: "8px 0", textAlign: "right" }}>Risk %</th>
                  </tr>
                </thead>
                <tbody>
                  {highRisk.map((student) => (
                    <motion.tr
                      key={student.student_id}
                      variants={listVariants}
                      whileHover={{ backgroundColor: "#FCE7F3", scale: 1.02 }}
                      style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                    >
                      <td style={{ padding: "12px 0", paddingLeft: "8px", fontWeight: "500", color: "#374151" }}>{student.student_id}</td>
                      <td style={{ padding: "12px 0", fontWeight: "500", color: "#374151" }}>{student.name}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#EF4444", fontWeight: "600" }}>
                        {(student.risk_score * 100).toFixed(1)}%
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            )}
          </motion.div>

          {/* Medium Risk */}
          <motion.div variants={listVariants} style={{ border: "1px solid #FFFBEB", borderRadius: "12px", padding: "24px", marginBottom: "24px", backgroundColor: "#FEFCE8" }}>
            <h4 style={{ marginBottom: "12px", color: "#F59E0B", fontWeight: "600" }}>Medium Risk Students</h4>
            {mediumRisk.length === 0 ? (
              <p style={{ color: "#9CA3AF" }}>No medium-risk students detected.</p>
            ) : (
              <motion.table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }} initial="hidden" animate="visible" variants={sectionVariants}>
                <thead>
                  <tr style={{ textAlign: "left", fontSize: "14px", color: "#6B7280" }}>
                    <th style={{ padding: "8px 0" }}>ID</th>
                    <th style={{ padding: "8px 0" }}>Name</th>
                    <th style={{ padding: "8px 0", textAlign: "right" }}>Risk %</th>
                  </tr>
                </thead>
                <tbody>
                  {mediumRisk.map((student) => (
                    <motion.tr
                      key={student.student_id}
                      variants={listVariants}
                      whileHover={{ backgroundColor: "#FCE7F3", scale: 1.02 }}
                      style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                    >
                      <td style={{ padding: "12px 0", paddingLeft: "8px", fontWeight: "500", color: "#374151" }}>{student.student_id}</td>
                      <td style={{ padding: "12px 0", fontWeight: "500", color: "#374151" }}>{student.name}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", color: "#F59E0B", fontWeight: "600" }}>
                        {(student.risk_score * 100).toFixed(1)}%
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={listVariants} style={{ padding: "20px", borderRadius: "12px", backgroundColor: "#F0F9FF", border: "1px solid #DBEAFE" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1D4ED8" }}>Recent Activity 🏃</h3>
            {[
              { text: "Student records uploaded successfully", time: "2 hours ago" },
              { text: "New student enrollment processed", time: "4 hours ago" },
              { text: "Attendance data synchronized", time: "8 hours ago" },
            ].map((activity, idx) => (
              <motion.div
                key={idx}
                variants={listVariants}
                style={{ padding: "12px 0", borderBottom: idx !== 2 ? "1px solid #BFDBFE" : "none" }}
              >
                <div style={{ fontWeight: "500", color: "#374151" }}>{activity.text}</div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>{activity.time}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "40px" }}>
        © 2025 EduDash. All rights reserved. | Privacy | Terms | Support
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div style={{ padding: "20px" }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/slogin" element={<StudentLoginPage />} />
        <Route path= "/counselor-signup" element={ <CounselorLogin /> }/>
        <Route path= "/admin-login" element= {<AdminLogin /> }/>
        
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<RiskDashboard />} />
        <Route path="/school" element={<SchoolDashboard />} />
        <Route path="/notification" element={<NotificationPanel />} />
        <Route path="/student-details" element={<StudentDetails />} />
        

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/ai-counsler" element={<Chatbot />} />
        <Route path="/gamification" element={<GamificationPage />} />
        <Route path="/motivation" element={<MotivationPage />} />
        <Route path= "/bot-impact" element= {<TelegramBotInteractionPage />}  />

        <Route path= "/admin" element= {<AdminDataDashboard />}  />
        <Route path= "/counsler-management" element= {<CounselorManagement />}  />
        <Route path= "/classs-management" element= {<ClassDepartmentDashboard/>}  />
        <Route path= "/reports-dashboard" element= {<ReportsDashboard/>}  />
        <Route path= "/upload" element= {<UploadForm/>}  />

        

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


