import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

import AttendanceRiskChart from "./AttendanceRiskChart";
import Navbar from "./Navbar";
import ExamRiskChart from "./ExamRiskChart";

// Custom hook to handle window width for responsive design
const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowWidth;
};

// Animation variants for section components
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1,
        },
    },
};

// Animation variants for individual cards/items
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function SchoolDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        highRiskCount: 0,
        attendanceRate: 0,
        feePaymentRate: 0,
    });
    const windowWidth = useWindowWidth();

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const gridColsStats = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)";

    const fetchRiskData = async () => {
        try {
            const res = await axios.get("https://student-risk-dashboard.onrender.com/risk");
            const studentsData = Array.isArray(res.data) ? res.data : res.data.risk || [];

            const totalStudents = studentsData.length;
            const highRisk = studentsData.filter((s) => s.risk_level?.toUpperCase() === "HIGH");
            const attendanceRiskCount = studentsData.filter((s) => s.attendance_risk > 0).length;
            const attendanceRate = totalStudents > 0 ? (((totalStudents - attendanceRiskCount) / totalStudents) * 100).toFixed(2) : 0;
            const feeRiskCount = studentsData.filter((s) => s.fee_risk > 0).length;
            const feePaymentRate = totalStudents > 0 ? (((totalStudents - feeRiskCount) / totalStudents) * 100).toFixed(2) : 0;

            setStudents(studentsData);
            setStats({
                totalStudents,
                highRiskCount: highRisk.length,
                attendanceRate,
                feePaymentRate,
            });
        } catch (err) {
            console.error("Error fetching risk data:", err);
            // Optionally set an error state to display to the user
        }
    };

    useEffect(() => {
        fetchRiskData();
    }, []);

    // Helper function for color-coding stats cards
    const getStatColor = (title) => {
        switch (title) {
            case "Total Students":
                return "#1D4ED8"; // Blue-700
            case "Attendance Rate":
                return "#059669"; // Green-600
            case "Fees Collected":
                return "#F59E0B"; // Amber-500
            case "Dropout Student":
                return "#DC2626"; // Red-600
            default:
                return "#4B5563";
        }
    };

    const statsCards = [
        { title: "Total Students", value: stats.totalStudents, change: "↑ 12% from last month", icon: "🧑‍🎓" },
        { title: "Attendance Rate", value: `${stats.attendanceRate}%`, change: "↑ 1.2% from last week", icon: "📊" },
        { title: "Fees Collected", value: `${stats.feePaymentRate}%`, change: "↓ 5% from last month", icon: "💰" },
        { title: "Dropout Student", value: stats.highRiskCount, change: "↓ Near By Dropout", icon: "⚠️" },
    ];

    return (
        <div style={{ padding: "24px", backgroundColor: "#f3f4f6", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
            <Navbar />

            {/* Dashboard Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ marginBottom: "32px" }}
            >
                <motion.h2 variants={itemVariants} style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}>
                    Class Dashboard 🏫
                </motion.h2>
                <motion.p variants={itemVariants} style={{ color: "#6b7280", fontSize: "16px" }}>
                    Your centralized hub for Class-wide performance and statistics.
                </motion.p>
            </motion.div>
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{
                    display: "grid",
                    gridTemplateColumns: gridColsStats,
                    gap: "24px",
                    marginBottom: "32px",
                }}
            >
                {statsCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, rotate: 1, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        style={{
                            backgroundColor: "#fff",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                            borderLeft: `5px solid ${getStatColor(card.title)}`,
                        }}
                    >
                        <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "600", marginBottom: "8px" }}>
                            {card.icon} {card.title}
                        </div>
                        <div style={{ fontSize: isMobile ? "28px" : "36px", fontWeight: "bold", color: "#111827", margin: "4px 0" }}>
                            {card.value}
                        </div>
                        <div style={{ fontSize: "14px", color: card.change.includes("↓") ? "#EF4444" : "#10B981" }}>
                            {card.change}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                >
                    <motion.h3 variants={itemVariants} style={{ fontWeight: "600", fontSize: "20px", marginBottom: "16px", color: "#374151" }}>
                        Attendance Trends 📈
                    </motion.h3>
                    <motion.div variants={itemVariants}>
                        <AttendanceRiskChart data={students} />
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                >
                    <motion.h3 variants={itemVariants} style={{ fontWeight: "600", fontSize: "20px", marginBottom: "16px", color: "#374151" }}>
                        Performance Overview 📊
                    </motion.h3>
                    <motion.div variants={itemVariants}>
                        <ExamRiskChart data={students} />
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ padding: "24px", marginBottom: "32px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontWeight: "600", fontSize: "20px", color: "#374151" }}>Top Risk Students 🔥</h3>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#4F46E5", // Indigo color
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "color 0.2s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#3730A3")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#4F46E5")}
                    >
                        View All →
                    </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {students.length > 0 ? (
                        students
                            .filter((s) => ["HIGH", "MEDIUM"].includes(s.risk_level?.toUpperCase()))
                            .sort((a, b) => (a.risk_level === "HIGH" ? -1 : 1))
                            .slice(0, 5)
                            .map((student, index) => {
                                let reason = "";
                                if (student.attendance_risk > 0) reason = "Poor Attendance";
                                else if (student.fee_risk > 0) reason = "Overdue Fees";
                                else if (student.exam_risk > 0) reason = "Low Exam Scores";

                                const riskColor = student.risk_level?.toUpperCase() === "HIGH" ? "#EF4444" : "#F59E0B";

                                return (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "16px",
                                            backgroundColor: "#f9fafb",
                                            borderRadius: "8px",
                                            borderLeft: `5px solid ${riskColor}`,
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            transition: "transform 0.2s ease",
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div>
                                            <p style={{ fontWeight: "600", color: "#1f2937" }}>
                                                {student.name}
                                                <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "400" }}> • ID: {student.student_id}</span>
                                            </p>
                                            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                                                <span style={{ fontWeight: "bold", color: riskColor }}>{student.risk_level} Risk:</span> {reason}
                                            </p>
                                        </div>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                                color: "#4B5563",
                                                fontSize: "14px",
                                                backgroundColor: "#E5E7EB",
                                                padding: "4px 8px",
                                                borderRadius: "9999px",
                                            }}
                                        >
                                            {student.risk_score.toFixed(2)}
                                        </span>
                                    </motion.div>
                                );
                            })
                    ) : (
                        <p style={{ textAlign: "center", color: "#9CA3AF", padding: "16px" }}>No risk data available. Please upload files to see the report.</p>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ padding: "24px", marginBottom: "24px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
            >
                <h3 style={{ fontWeight: "600", fontSize: "20px", marginBottom: "16px", color: "#374151" }}>Key Insights & Patterns 💡</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                    {[
                        "Attendance Improvement",
                        "Top Performing Class",
                        "Fee Collection Alert",
                        "Peak Absence Days",
                    ].map((insight, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                backgroundColor: "#ECFDF5", // Green-50
                                padding: "16px",
                                borderRadius: "8px",
                                fontWeight: "500",
                                color: "#065F46", // Green-700
                                border: "1px solid #A7F3D0", // Green-200
                                cursor: "pointer",
                            }}
                        >
                            {insight}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default SchoolDashboard;