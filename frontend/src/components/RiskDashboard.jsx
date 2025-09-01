import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "./Navbar";

function RiskDashboard() {
    const [riskData, setRiskData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/risk")
            .then(res => {
                if (res.data.error) {
                    setRiskData([]);
                    alert(res.data.error); // Show exact issue
                } else {
                    setRiskData(res.data.risk || []);
                }
            })
            .catch(err => console.error(err));
    }, []);



    // If data is empty, display a message
    if (riskData.length === 0) {
        return <div style={{ padding: "20px" }}>No risk data available. Please go back and upload all files.</div>;
    }

    // Prepare chart data (rest of your component)
    const chartData = [
        { name: "High", value: riskData.filter(r => r.risk_level === "High").length },
        { name: "Medium", value: riskData.filter(r => r.risk_level === "Medium").length },
        { name: "Low", value: riskData.filter(r => r.risk_level === "Low").length }
    ];

    // Filtering students by specific risk factors
    const attendanceRiskStudents = riskData.filter(r => r.attendance_risk === 1);
    const examRiskStudents = riskData.filter(r => r.exam_risk === 1);
    const feeRiskStudents = riskData.filter(r => r.fee_risk === 1);

    const highRiskStudents = riskData.filter(r => r.risk_level === "High");
    const mediumRiskStudents = riskData.filter(r => r.risk_level === "Medium");
    const lowRiskStudents = riskData.filter(r => r.risk_level === "Low");

    const COLORS = ["#FF4C4C", "#FFD93D", "#4CAF50"];

    return (
        <div style={{ padding: "20px" }}>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "center", backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                    📊 Student Dropout Reports
                </h2>
            </div>

            <div style={{ display: "flex", justifyContent: "center", backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                {/* Risk Distribution Chart */}
                <PieChart width={400} height={300}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4b5563' }}>
                    <p style={{ color: '#111827' }}>
                        All Students: <span style={{ fontWeight: '700' }}>{riskData.length}</span>
                    </p>
                </h4>
            </div>

            <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>
                {/* Risk Table */}
                <div style={{ display: "flex", justifyContent: "center", backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                    <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px", marginBottom: '50px', borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f0f0f0" }}>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Attendance Risk</th>
                                <th>Exam Risk</th>
                                <th>Fee Risk</th>
                                <th>Risk Score</th>
                                <th>Risk Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riskData.map((r, idx) => (
                                <tr key={idx} style={{
                                    background: r.risk_level === "High" ? "#ffcccc" :
                                        r.risk_level === "Medium" ? "#fff7cc" : "#ccffcc"
                                }}>
                                    <td>{r.student_id}</td>
                                    <td>{r.name}</td>
                                    <td>{r.attendance_risk}</td>
                                    <td>{r.exam_risk}</td>
                                    <td>{r.fee_risk}</td>
                                    <td>{r.risk_score.toFixed(2)}</td>
                                    <td>{r.risk_level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>
                        High-Risk Students ({highRiskStudents.length})
                    </h2>
                    {highRiskStudents.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ minWidth: '100%', backgroundColor: '#fef2f2', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#fecaca', color: '#374151', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #fca5a5' }}>Student Name</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #fca5a5' }}>Student ID</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #fca5a5' }}>Risk Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {highRiskStudents.map((student, index) => (
                                        <tr key={student.student_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fef2f2' }}>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #fecaca' }}>{student.name}</td>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #fecaca', color: '#dc2626', fontWeight: '500' }}>{student.student_id}</td>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #fecaca', fontWeight: '600', color: '#ef4444' }}>{student.risk_level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No high-risk students found.</p>
                    )}
                </div>

                {/* Medium-Risk Students Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#ca8a04', marginBottom: '1rem', textAlign: 'center' }}>
                        Medium-Risk Students ({mediumRiskStudents.length})
                    </h2>
                    {mediumRiskStudents.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ minWidth: '100%', backgroundColor: '#fffef2', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#fef08a', color: '#374151', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #fcd34d' }}>Student Name</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #fcd34d' }}>Student ID</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #fcd34d' }}>Risk Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mediumRiskStudents.map((student, index) => (
                                        <tr key={student.student_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fffef2' }}>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #fef08a' }}>{student.name}</td>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #fef08a', color: '#ca8a04', fontWeight: '500' }}>{student.student_id}</td>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #fef08a', fontWeight: '600', color: '#eab308' }}>{student.risk_level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No medium-risk students found.</p>
                    )}
                </div>

                {/* Low-Risk Students Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#16a34a', marginBottom: '1rem', textAlign: 'center' }}>
                        Low-Risk Students ({lowRiskStudents.length})
                    </h2>
                    {lowRiskStudents.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ minWidth: '100%', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#dcfce7', color: '#374151', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #86efac' }}>Student Name</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #86efac' }}>Student ID</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #86efac' }}>Risk Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowRiskStudents.map((student, index) => (
                                        <tr key={student.student_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0fdf4' }}>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #dcfce7' }}>{student.name}</td>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #dcfce7', color: '#16a34a', fontWeight: '500' }}>{student.student_id}</td>
                                            <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #dcfce7', fontWeight: '600', color: '#22c55e' }}>{student.risk_level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No low-risk students found.</p>
                    )}
                </div>
            </div>

            {/* Attendance Risk Students Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#2563eb', marginBottom: '1rem', textAlign: 'center' }}>
                    Students with Attendance Risk ({attendanceRiskStudents.length})
                </h2>
                {attendanceRiskStudents.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ minWidth: '100%', backgroundColor: '#eff6ff', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <thead style={{ backgroundColor: '#bfdbfe', color: '#1f2937', textAlign: 'left' }}>
                                <tr>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #93c5fd' }}>Student Name</th>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #93c5fd' }}>Student ID</th>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #93c5fd' }}>Attendance Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRiskStudents.map((student, index) => (
                                    <tr key={student.student_id} style={index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: '#eff6ff' }}>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #bfdbfe' }}>{student.name}</td>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #bfdbfe', color: '#2563eb', fontWeight: '500' }}>{student.student_id}</td>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #bfdbfe', fontWeight: '600', color: '#3b82f6' }}>{student.attendance_risk}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280', paddingTop: '1rem', paddingBottom: '1rem' }}>No students with attendance risk found.</p>
                )}
            </div>

            {/* Exam Risk Students Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#9333ea', marginBottom: '1rem', textAlign: 'center' }}>
                    Students with Exam Risk ({examRiskStudents.length})
                </h2>
                {examRiskStudents.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ minWidth: '100%', backgroundColor: '#f5f3ff', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <thead style={{ backgroundColor: '#e9d5ff', color: '#1f2937', textAlign: 'left' }}>
                                <tr>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #d8b4fe' }}>Student Name</th>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #d8b4fe' }}>Student ID</th>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #d8b4fe' }}>Exam Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examRiskStudents.map((student, index) => (
                                    <tr key={student.student_id} style={index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: '#f5f3ff' }}>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #e9d5ff' }}>{student.name}</td>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #e9d5ff', color: '#9333ea', fontWeight: '500' }}>{student.student_id}</td>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #e9d5ff', fontWeight: '600', color: '#a855f7' }}>{student.exam_risk}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280', paddingTop: '1rem', paddingBottom: '1rem' }}>No students with exam risk found.</p>
                )}
            </div>

            {/* Fee Risk Students Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#0d9488', marginBottom: '1rem', textAlign: 'center' }}>
                    Students with Fee Risk ({feeRiskStudents.length})
                </h2>
                {feeRiskStudents.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ minWidth: '100%', backgroundColor: '#f0fdfa', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <thead style={{ backgroundColor: '#99f6e4', color: '#1f2937', textAlign: 'left' }}>
                                <tr>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #5eead4' }}>Student Name</th>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #5eead4' }}>Student ID</th>
                                    <th style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', borderBottom: '1px solid #5eead4' }}>Fee Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeRiskStudents.map((student, index) => (
                                    <tr key={student.student_id} style={index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: '#f0fdfa' }}>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #99f6e4' }}>{student.name}</td>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #99f6e4', color: '#0d9488', fontWeight: '500' }}>{student.student_id}</td>
                                        <td style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid #99f6e4', fontWeight: '600', color: '#14b8a6' }}>{student.fee_risk}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280', paddingTop: '1rem', paddingBottom: '1rem' }}>No students with fee risk found.</p>
                )}
            </div>

        </div>




    );
}

export default RiskDashboard;