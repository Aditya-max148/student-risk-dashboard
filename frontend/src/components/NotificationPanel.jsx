import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import axios from "axios";

const NotificationPanel = () => {
    const [students, setStudents] = useState([]);
    const [resolvedStudents, setResolvedStudents] = useState([]);

    // ✅ Function to mark student as resolved
    const markResolved = (studentId) => {
        setResolvedStudents((prev) => [...prev, studentId]);
    };

    // ✅ Fetch risk data
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

    // ✅ Fetch data on mount
    useEffect(() => {
        fetchRiskData();
    }, [fetchRiskData]);

    // ✅ Handle report download
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
        <div
            style={{
                padding: "24px",
                backgroundColor: "#f9fafb",
                minHeight: "100vh",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <Navbar />
            <div style={{ flex: 1, padding: "20px" }}>
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
                        students.map((student, index) => {
                            const isResolved = resolvedStudents.includes(student.student_id);
                            return (
                                <div
                                    key={student.student_id || index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "15px 15px",
                                        borderRadius: "20px",
                                        borderBottom:
                                            index !== students.length - 1
                                                ? "1px solid #eee"
                                                : "none",
                                        backgroundColor: isResolved ? "#e6ffed" : "#ffe6e6",
                                    }}
                                >
                                    <p style={{ fontWeight: "500", margin: 0, color: "#333" }}>
                                        {student.name || `Student ${index + 1}`} at{" "}
                                        <span style={{ color: "red" }}>High Risk</span> -- Notify
                                        Parent?
                                    </p>
                                    <div>
                                        <button
                                            style={{
                                                backgroundColor: isResolved ? "green" : "#fff",
                                                color: isResolved ? "#fff" : "#000",
                                                cursor: "pointer",
                                                padding: "10px 16px",
                                                border: "none",
                                                borderRadius: "6px",
                                                fontWeight: "bold",
                                                marginRight: "10px",
                                            }}
                                            onClick={() =>
                                                alert(
                                                    `Email sent to ${student.parent_email || "Parent"
                                                    }`
                                                )
                                            }
                                        >
                                            Email
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: isResolved ? "green" : "#fff",
                                                color: isResolved ? "#fff" : "#000",
                                                cursor: "pointer",
                                                padding: "10px 16px",
                                                border: "none",
                                                borderRadius: "6px",
                                                fontWeight: "bold",
                                            }}
                                            onClick={() => markResolved(student.student_id)}
                                        >
                                            {isResolved ? "✅ Resolved" : "Mark as Resolved"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
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
