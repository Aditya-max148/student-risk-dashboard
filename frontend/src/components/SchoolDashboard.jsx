import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, User, DollarSign, BarChart3, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SchoolDashboard() {
    const navigate = useNavigate(); // ✅ FIX: useNavigate is now inside DashboardPage
    const handleFinalSubmit = () => navigate("/dashboard");

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
        <div style={{ padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            {/* Navbar */}
            <div style={{ backgroundColor: "#fff", padding: "10px 20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>EduDash</div>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", fontSize: "14px" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            padding: "10px 20px",

                        }}
                    >
                        <Link
                            to="/dashboard"
                            style={{
                                textDecoration: "none",
                                color: "#007BFF",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/students"
                            style={{
                                textDecoration: "none",
                                color: "#007BFF",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Students
                        </Link>

                        <Link
                            to="/reports"
                            style={{
                                textDecoration: "none",
                                color: "#007BFF",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Reports
                        </Link>

                        <Link
                            to="/settings"
                            style={{
                                textDecoration: "none",
                                color: "#007BFF",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Settings
                        </Link>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#ccc" }}></div>
                </div>
            </div>


            {/* Dashboard Header */}
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>School Dashboard</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>Overview of school-wide performance and statistics</p>

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

            {/* Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Attendance Trends</h3>
                    <div style={{ border: "1px dashed #d1d5db", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                        Attendance Chart Placeholder
                    </div>
                </div>

                <div style={{ padding: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Performance Overview</h3>
                    <div style={{ border: "1px dashed #d1d5db", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                        Performance Chart Placeholder
                    </div>
                </div>
            </div>

            {/* Top Risk Students */}
            <div
                style={{
                    padding: "24px",
                    marginBottom: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "16px"
                    }}
                >
                    <h3 style={{ fontWeight: "600" }}>Top Risk Students</h3>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/students")} // Optional: Go to full student list
                    >
                        View All
                    </button>
                </div>

                {/* Dynamic Students */}
                <div
                    style={{
                        padding: "24px",
                        marginBottom: "24px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "16px",
                        }}
                    >
                        <h3 style={{ fontWeight: "600" }}>Top Risk Students</h3>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                color: "#2563eb",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/students")}
                        >
                            View All
                        </button>
                    </div>

                    {/* Student List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {students.length > 0 ? (
                            students
                                .filter(
                                    (s) =>
                                        s.risk_level?.toUpperCase() === "HIGH" ||
                                        s.risk_level?.toUpperCase() === "MEDIUM"
                                )
                                .sort((a, b) => (a.risk_level === "HIGH" ? -1 : 1)) // High risk first
                                .slice(0, 3) // Only top 3
                                .map((student, index) => {
                                    // Find reason
                                    let reason = "";
                                    if (student.attendance_risk > 0)
                                        reason = `Attendance: ${student.attendance}%`;
                                    else if (student.fee_risk > 0)
                                        reason = `Fees overdue: ${student.fees_overdue_days || 0} days`;
                                    else if (student.performance_risk > 0)
                                        reason = `Performance: ${student.performance}%`;

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
                                                borderLeft: `4px solid ${student.risk_level?.toUpperCase() === "HIGH"
                                                    ? "#ef4444"
                                                    : "#f59e0b"
                                                    }`,
                                            }}
                                        >
                                            <p style={{ fontWeight: "500" }}>
                                                {student.name} - Grade {student.grade || "N/A"}
                                            </p>
                                            <span
                                                style={{
                                                    color:
                                                        student.risk_level?.toUpperCase() === "HIGH"
                                                            ? "#ef4444"
                                                            : "#f59e0b",
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
                            <p style={{ textAlign: "center", color: "#6b7280" }}>
                                No risk data available
                            </p>
                        )}
                    </div>
                </div>



                {/* Key Insights */}
                <div style={{ padding: "24px", marginBottom: "24px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ fontWeight: "600", marginBottom: "16px" }}>Key Insights & Patterns</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                        <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Attendance Improvement</div>
                        <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Top Performing Class</div>
                        <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Fee Collection Alert</div>
                        <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>Peak Absence Days</div>
                    </div>
                </div>

                {/* Pagination */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
                    <button style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer" }}><ArrowLeft /></button>
                    <span>3 / 4</span>
                    <button style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer" }}><ArrowRight /></button>
                </div>
            </div>
        </div>
    );
};


export default SchoolDashboard