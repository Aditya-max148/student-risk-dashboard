import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPanel = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        highRiskCount: 0,
        attendanceRate: 0,
        feePaymentRate: 0,
    });

    const handleGenerateReport = async () => {
        try {
            const response = await axios.get("https://student-risk-dashboard.onrender.com/generate-report", { responseType: "blob" });  


            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "dropout_probability_report.pdf"); // Change extension if CSV
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Failed to generate report.");
        }
    };
    // Fetch Risk Data
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
                    ? (
                        ((totalStudents - attendanceRiskCount) / totalStudents) *
                        100
                    ).toFixed(2)
                    : 0;

            const feeRiskCount = studentsData.filter((s) => s.fee_risk > 0).length;
            const feePaymentRate =
                totalStudents > 0
                    ? (
                        ((totalStudents - feeRiskCount) / totalStudents) *
                        100
                    ).toFixed(2)
                    : 0;

            setStudents(highRisk); // Only keep high-risk students for alerts
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
        <div
            style={{ padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}
        >

            {/* Sidebar */}
            <Navbar />

            {/* Main Content */}
            <div style={{ flex: 1, padding: "20px" }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "red" }}>
                        Notifications / Alerts Panel
                    </h1>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#ddd",
                        }}
                    ></div>
                </div>

                {/* Notification Cards */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        marginBottom: "20px",
                    }}
                >
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <div
                                key={student.student_id || index}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "15px 0",
                                    borderBottom:
                                        index !== students.length - 1 ? "1px solid #eee" : "none",
                                }}
                            >
                                <p style={{ fontWeight: "500", margin: 0, color: "#333" }}>
                                    {student.name || `Student ${index + 1}`} at{" "}
                                    <span style={{ color: "red" }}>High Risk</span> -- Notify Parent?
                                </p>
                                <div>
                                    <button
                                        style={{
                                            padding: "6px 12px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#fff",
                                            marginRight: "5px",
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                        }}
                                        onClick={() =>
                                            alert(`Email sent to ${student.parent_email || "Parent"}`)
                                        }
                                    >
                                        Email
                                    </button>
                                    <button
                                        style={{
                                            padding: "6px 12px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#fff",
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                        }}
                                        onClick={() =>
                                            alert(
                                                `Marked ${student.name || "Student"} as resolved.`
                                            )
                                        }
                                    >
                                        Mark as Resolved
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", color: "#999" }}>
                            No high-risk students right now.
                        </p>
                    )}
                </div>
                {/* Reports Section */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                        Reports / Export
                    </h2>
                    <button
                        onClick={handleGenerateReport}
                        style={{
                            padding: "10px 16px",
                            border: "none",
                            backgroundColor: "red",
                            color: "#fff",
                            cursor: "pointer",
                            borderRadius: "6px",
                            fontWeight: "bold",
                        }}
                    >
                        Generate Dropout Probability Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
