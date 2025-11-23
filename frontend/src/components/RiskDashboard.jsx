import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "./Navbar";
import { motion } from "framer-motion"; // For animations

// Custom hook for responsive font size
const useResponsiveFontSize = () => {
    const [fontSize, setFontSize] = useState("14px");

    useEffect(() => {
        const handleResize = () => {
            setFontSize(window.innerWidth < 600 ? "12px" : "14px");
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return fontSize;
};

// Animation variants for sections
const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Animation variants for table rows
const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function RiskDashboard() {
    const [riskData, setRiskData] = useState([]);
    const fontSize = useResponsiveFontSize();

    useEffect(() => {
        axios.get("https://student-risk-dashboard.onrender.com/risk")
            .then(res => {
                if (res.data.error) {
                    setRiskData([]);
                    alert(res.data.error);
                } else {
                    setRiskData(res.data.risk || []);
                }
            })
            .catch(err => console.error("Error fetching risk data:", err));
    }, []);

    if (riskData.length === 0) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f2f5",
                fontFamily: 'Inter, sans-serif',
                color: "#4a5568",
                fontSize: "1.2rem",
                textAlign: "center",
                padding: "20px"
            }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    style={{
                        backgroundColor: "white",
                        padding: "40px",
                        borderRadius: "1rem",
                        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    }}
                >
                    <p>No risk data available. Please go back and upload all files. 😞</p>
                </motion.div>
            </div>
        );
    }

    const chartData = [
        { name: "High Risk", value: riskData.filter(r => r.risk_level === "High").length },
        { name: "Medium Risk", value: riskData.filter(r => r.risk_level === "Medium").length },
        { name: "Low Risk", value: riskData.filter(r => r.risk_level === "Low").length }
    ];

    const attendanceRiskStudents = riskData.filter(r => r.attendance_risk === 1);
    const examRiskStudents = riskData.filter(r => r.exam_risk === 1);
    const feeRiskStudents = riskData.filter(r => r.fee_risk === 1);

    const highRiskStudents = riskData.filter(r => r.risk_level === "High");
    const mediumRiskStudents = riskData.filter(r => r.risk_level === "Medium");
    const lowRiskStudents = riskData.filter(r => r.risk_level === "Low");

    const COLORS = ["#EF4444", "#F59E0B", "#10B981"]; // Brighter, more distinct colors

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center'
    };

    const tableHeaderStyle = {
        padding: '12px 10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: '0.875rem',
        textAlign: 'left',
        borderBottom: '1px solid',
    };

    const tableCellStyle = {
        padding: '10px',
        textAlign: 'center',
        borderBottom: '1px solid',
    };

    return (
        <div style={{ padding: "20px", backgroundColor: '#f0f2f5', fontFamily: 'Inter, sans-serif' }}>
            <Navbar />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
                style={{ ...cardStyle, padding: '0.5rem', marginBottom: '2rem' }}
            >
                <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#DC2626', marginBottom: '1rem', textAlign: 'center', letterSpacing: '-0.025em' }}>
                    📊 Student Dropout Reports
                </h2>
                <p style={{ color: '#4A5568', fontSize: '1.1rem' }}>Insights for proactive student support in Rajsthan. 📍</p>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
                style={{ ...cardStyle, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'column' }}
            >
                <h3 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#2D3748', marginBottom: '1.5rem' }}>Risk Distribution</h3>
                <PieChart width={400} height={350}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60} // Donut chart style
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                                style={{
                                    filter: `drop-shadow(0px 0px 5px ${COLORS[index % COLORS.length]}50)`
                                }}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} Students`} />
                    <Legend wrapperStyle={{ fontSize: fontSize, paddingTop: '10px' }} />
                </PieChart>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={sectionVariants} style={{ ...cardStyle }}>
                <h4 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#2D3748' }}>
                    Total Students Monitored: <span style={{ fontWeight: '700', color: '#0A7F4B' }}>{riskData.length}</span>
                </h4>
            </motion.div>

            {/* Main Risk Table */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
                style={{ ...cardStyle, padding: '2rem', overflowX: "auto" }}
            >
                <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#2D3748', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Comprehensive Student Risk Overview 📋
                </h2>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate", // Use separate for rounded corners
                        borderSpacing: "0 8px", // Space between rows
                        fontSize: fontSize,
                        minWidth: "700px", // Ensure responsiveness
                    }}
                >
                    <thead>
                        <tr style={{ background: "#E2E8F0", borderRadius: '0.5rem' }}>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0', borderTopLeftRadius: '0.5rem', paddingLeft: '20px' }}>Student ID</th>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0' }}>Student Name</th>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0' }}>Attendance Risk</th>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0' }}>Exam Risk</th>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0' }}>Fee Risk</th>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0' }}>Risk Score</th>
                            <th style={{ ...tableHeaderStyle, borderBottomColor: '#CBD5E0', borderTopRightRadius: '0.5rem', paddingRight: '20px' }}>Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riskData.map((r, idx) => (
                            <motion.tr
                                key={idx}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                custom={idx * 0.1} // Stagger animation
                                style={{
                                    background:
                                        r.risk_level === "High"
                                            ? "#FEE2E2" // Red-100
                                            : r.risk_level === "Medium"
                                                ? "#FFFBEB" // Yellow-100
                                                : "#ECFDF5", // Green-100
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
                                }}
                            >
                                <td style={{ ...tableCellStyle, borderBottomColor: '#E2E8F0', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', paddingLeft: '20px' }}>{r.student_id}</td>
                                <td style={{ ...tableCellStyle, borderBottomColor: '#E2E8F0', textAlign: 'left', fontWeight: '500', color: '#2D3748' }}>{r.name}</td>
                                <td style={{ ...tableCellStyle, borderBottomColor: '#E2E8F0' }}>
                                    {r.attendance_risk === 1 ? <span style={{ color: '#EF4444', fontWeight: 'bold' }}>Yes</span> : "No"}
                                </td>
                                <td style={{ ...tableCellStyle, borderBottomColor: '#E2E8F0' }}>
                                    {r.exam_risk === 1 ? <span style={{ color: '#EF4444', fontWeight: 'bold' }}>Yes</span> : "No"}
                                </td>
                                <td style={{ ...tableCellStyle, borderBottomColor: '#E2E8F0' }}>
                                    {r.fee_risk === 1 ? <span style={{ color: '#EF4444', fontWeight: 'bold' }}>Yes</span> : "No"}
                                </td>
                                <td style={{ ...tableCellStyle, borderBottomColor: '#E2E8F0', fontWeight: '600' }}>{r.risk_score.toFixed(2)}</td>
                                <td style={{
                                    ...tableCellStyle,
                                    borderBottomColor: '#E2E8F0',
                                    borderTopRightRadius: '0.5rem',
                                    borderBottomRightRadius: '0.5rem',
                                    paddingRight: '20px',
                                    fontWeight: 'bold',
                                    color:
                                        r.risk_level === "High"
                                            ? "#EF4444"
                                            : r.risk_level === "Medium"
                                                ? "#F59E0B"
                                                : "#10B981",
                                }}>
                                    {r.risk_level}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Risk Level Specific Tables */}
            {[
                { title: "High-Risk Students 🚨", students: highRiskStudents, color: '#DC2626', bgColor: '#FEE2E2', headerBg: '#FCA5A5', borderColor: '#F87171' },
                { title: "Medium-Risk Students ⚠️", students: mediumRiskStudents, color: '#CA8A04', bgColor: '#FFFBEB', headerBg: '#FCD34D', borderColor: '#FBBF24' },
                { title: "Low-Risk Students ✅", students: lowRiskStudents, color: '#16A34A', bgColor: '#ECFDF5', headerBg: '#A7F3D0', borderColor: '#6EE7B7' },
            ].map((section, sectionIdx) => (
                <motion.div
                    key={sectionIdx}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    style={{ ...cardStyle, padding: '1.5rem', marginBottom: '2rem' }}
                >
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '700', color: section.color, marginBottom: '1.5rem', textAlign: 'center' }}>
                        {section.title} ({section.students.length})
                    </h2>
                    {section.students.length > 0 ? (
                        <div style={{ overflowX: 'auto', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                            <table style={{ minWidth: '100%', backgroundColor: section.bgColor, borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ backgroundColor: section.headerBg, color: '#374151', textAlign: 'left' }}>
                                        <th style={{ ...tableHeaderStyle, borderBottomColor: section.borderColor, paddingLeft: '1rem' }}>Student Name</th>
                                        <th style={{ ...tableHeaderStyle, borderBottomColor: section.borderColor }}>Student ID</th>
                                        <th style={{ ...tableHeaderStyle, borderBottomColor: section.borderColor, paddingRight: '1rem' }}>Risk Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.students.map((student, index) => (
                                        <motion.tr
                                            key={student.student_id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={index * 0.1}
                                            style={{ backgroundColor: index % 2 === 0 ? 'white' : section.bgColor, transition: 'background-color 0.3s ease' }}
                                            whileHover={{ backgroundColor: '#F3F4F6', scale: 1.01 }}
                                        >
                                            <td style={{ ...tableCellStyle, borderBottomColor: section.headerBg, textAlign: 'left', paddingLeft: '1rem' }}>{student.name}</td>
                                            <td style={{ ...tableCellStyle, borderBottomColor: section.headerBg, color: section.color, fontWeight: '500' }}>{student.student_id}</td>
                                            <td style={{ ...tableCellStyle, borderBottomColor: section.headerBg, fontWeight: '600', color: section.color, paddingRight: '1rem' }}>{student.risk_level}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No {section.title.toLowerCase().replace('🚨', '').replace('⚠️', '').replace('✅', '')} found.</p>
                    )}
                </motion.div>
            ))}

            {/* Specific Risk Factor Tables */}
            {[
                { title: "Students with Attendance Risk 🏃", students: attendanceRiskStudents, color: '#2563EB', bgColor: '#EFF6FF', headerBg: '#BFDBFE', borderColor: '#93C5FD' },
                { title: "Students with Exam Risk 📚", students: examRiskStudents, color: '#9333EA', bgColor: '#F5F3FF', headerBg: '#E9D5FF', borderColor: '#D8B4FE' },
                { title: "Students with Fee Risk 💰", students: feeRiskStudents, color: '#0D9488', bgColor: '#F0FDF4', headerBg: '#99F6E4', borderColor: '#5EEAD4' },
            ].map((section, sectionIdx) => (
                <motion.div
                    key={sectionIdx}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    style={{ ...cardStyle, marginBottom: sectionIdx === 2 ? '0' : '2rem' }}
                >
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '700', color: section.color, marginBottom: '1.5rem', textAlign: 'center' }}>
                        {section.title} ({section.students.length})
                    </h2>
                    {section.students.length > 0 ? (
                        <div style={{ overflowX: 'auto', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                            <table style={{ minWidth: '100%', backgroundColor: section.bgColor, borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ backgroundColor: section.headerBg, color: '#1f2937', textAlign: 'left' }}>
                                        <th style={{ ...tableHeaderStyle, borderBottomColor: section.borderColor, paddingLeft: '1rem' }}>Student Name</th>
                                        <th style={{ ...tableHeaderStyle, borderBottomColor: section.borderColor }}>Student ID</th>
                                        <th style={{ ...tableHeaderStyle, borderBottomColor: section.borderColor, paddingRight: '1rem' }}>{section.title.split(' ')[2]}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.students.map((student, index) => (
                                        <motion.tr
                                            key={student.student_id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={index * 0.1}
                                            style={{ backgroundColor: index % 2 === 0 ? 'white' : section.bgColor, transition: 'background-color 0.3s ease' }}
                                            whileHover={{ backgroundColor: '#E2E8F0', scale: 1.01 }}
                                        >
                                            <td style={{ ...tableCellStyle, borderBottomColor: section.headerBg, textAlign: 'left', paddingLeft: '1rem' }}>{student.name}</td>
                                            <td style={{ ...tableCellStyle, borderBottomColor: section.headerBg, color: section.color, fontWeight: '500' }}>{student.student_id}</td>
                                            <td style={{ ...tableCellStyle, borderBottomColor: section.headerBg, fontWeight: '600', color: section.color, paddingRight: '1rem' }}>
                                                {section.title.includes("Attendance") ? student.risk_level :
                                                    section.title.includes("Exam") ? student.risk_level :
                                                        student.risk_level}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No {section.title.toLowerCase().replace('🏃', '').replace('📚', '').replace('💰', '')} found.</p>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

export default RiskDashboard;