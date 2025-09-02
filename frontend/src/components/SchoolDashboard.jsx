import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 
import AttendanceRiskChart from "./AttendanceRiskChart";
import Navbar from "./Navbar";
import ExamRiskChart from "./ExamRiskChart";

function SchoolDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        highRiskCount: 0,
        attendanceRate: 0,
        feePaymentRate: 0,
    });

    // Fetch Data
    const fetchRiskData = async () => {
        try {
            const res = await axios.get("https://student-risk-dashboard.onrender.com/risk");
            const studentsData = Array.isArray(res.data)
                ? res.data
                : res.data.risk || [];

            const totalStudents = studentsData.length;

            const highRisk = studentsData.filter(
                (s) => s.risk_level?.toUpperCase() === "HIGH"
            );

            const attendanceRiskCount = studentsData.filter(
                (s) => s.attendance_risk > 0
            ).length;

            const attendanceRate =
                totalStudents > 0
                    ? (((totalStudents - attendanceRiskCount) / totalStudents) * 100).toFixed(2)
                    : 0;

            const feeRiskCount = studentsData.filter((s) => s.fee_risk > 0).length;
            const feePaymentRate =
                totalStudents > 0
                    ? (((totalStudents - feeRiskCount) / totalStudents) * 100).toFixed(2)
                    : 0;

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

    useEffect(() => {
        fetchRiskData();
    }, []);

    return (
        <div style={{ padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            {/* Navbar */}
            <Navbar />

            {/* Dashboard Header */}
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Class Dashboard</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>Overview of school-wide performance and statistics</p>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
                {[
                    { title: "Total Students", value: stats.totalStudents, change: "↑ 12% from last month" },
                    { title: "Attendance Rate", value: `${stats.attendanceRate}%`, change: "↓ 1.2% from last week" },
                    { title: "Fees Collected", value: `${stats.feePaymentRate}%`, change: "↑ 5% from last month" },
                    { title: "Near-dropout students", value: stats.highRiskCount, change: "↓ 20% Dropout Increase" },
                ].map((card, idx) => (
                    <div key={idx} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: "14px", color: "#6b7280" }}>{card.title}</div>
                        <div style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}>{card.value}</div>
                        <div style={{ fontSize: "12px", color: card.change.includes("↓") ? "red" : "green" }}>{card.change}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {/* Attendance Chart */}
                <div style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Attendance Trends</h3>
                    <AttendanceRiskChart data={students} />
                </div>

                {/* Risk Pie Chart */}
                 <div style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Performance Overview</h3>
                    <ExamRiskChart data={students} />
                </div>
            </div>

            {/* Top Risk Students */}
            <div style={{ padding: "24px", marginBottom: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontWeight: "600" }}>Top Risk Students</h3>
                    <button
                        style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}
                        onClick={() => navigate("/dashboard")}
                    >
                        View All
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {students.length > 0 ? (
                        students
                            .filter((s) => ["HIGH", "MEDIUM"].includes(s.risk_level?.toUpperCase()))
                            .sort((a, b) => (a.risk_level === "HIGH" ? -1 : 1))
                            .slice(0, 5)
                            .map((student, index) => {
                                let reason = "";
                                if (student.attendance_risk > 0) reason = `Attendance Risk: ${(student.attendance_risk * 100).toFixed(2)}%`;
                                else if (student.fee_risk > 0) reason = `Fees overdue: ${(student.fee_risk * 100).toFixed(2)}%`;
                                else if (student.exam_risk > 0) reason = `Exam Risk: ${(student.exam_risk * 100).toFixed(2)}%`;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px",
                                            backgroundColor: "#f9fafb",
                                            borderRadius: "6px",
                                            borderLeft: `4px solid ${student.risk_level?.toUpperCase() === "HIGH" ? "#ef4444" : "#f59e0b"}`,
                                        }}
                                    >
                                        <p style={{ fontWeight: "500" }}>
                                            {student.name} - Dropout Risk: {(student.risk_score * 100).toFixed(2)}%
                                        </p>
                                        <span
                                            style={{
                                                color: student.risk_level?.toUpperCase() === "HIGH" ? "#ef4444" : "#f59e0b",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {student.risk_level} Risk • {reason}
                                        </span>
                                    </div>
                                );
                            })
                    ) : (
                        <p style={{ textAlign: "center", color: "#6b7280" }}>No risk data available</p>
                    )}
                </div>
            </div>

            {/* Insights */}
            <div style={{ padding: "24px", marginBottom: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontWeight: "600", marginBottom: "16px" }}>Key Insights & Patterns</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                    <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Attendance Improvement</div>
                    <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Top Performing Class</div>
                    <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Fee Collection Alert</div>
                    <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Peak Absence Days</div>
                </div>
            </div>
        </div>
    );
}

export default SchoolDashboard;
