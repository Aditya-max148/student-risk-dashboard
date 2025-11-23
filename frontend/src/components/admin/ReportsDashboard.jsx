// ReportsDashboard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiFileText, FiUsers, FiTrendingDown, FiAlertCircle, FiCalendar, FiFilter } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Anavbar from "./Anavbar";

const mockReports = [
  { id: 1, title: "Monthly Dropout Risk Summary", type: "PDF", date: "2025-11-19", size: "245 KB", category: "Risk Analysis" },
  { id: 2, title: "Department-wise Attendance Report", type: "Excel", date: "2025-11-15", size: "189 KB", category: "Attendance" },
  { id: 3, title: "High-Risk Students List (Nov 2025)", type: "PDF", date: "2025-11-18", size: "312 KB", category: "Intervention" },
  { id: 4, title: "Counselor Load & Performance", type: "Excel", date: "2025-11-10", size: "156 KB", category: "Counselor" },
  { id: 5, title: "Fees Defaulters Report", type: "PDF", date: "2025-11-12", size: "278 KB", category: "Finance" },
];

function ReportsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Generate & Download PDF Report
  const generatePDF = (title, data, columns) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Syntax of Success - AI Dropout Prevention", 14, 22);
    doc.setFontSize(16);
    doc.text(title, 14, 35);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 45);

    doc.autoTable({
      head: [columns],
      body: data,
      startY: 55,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save(`${title.replace(/ /g, "_")}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Generate & Download Excel
  const generateExcel = (title, data, columns) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${title.replace(/ /g, "_")}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Sample Report Generators
  const generateReport = (type) => {
    if (type === "risk-summary") {
      const data = [
        ["Computer Science", 245, 32, 12, "13.1%"],
        ["Electronics & Comm.", 198, 28, 9, "14.1%"],
        ["Mechanical Engg.", 180, 15, 4, "8.3%"],
        ["Civil Engg.", 165, 22, 7, "13.3%"],
      ];
      generatePDF("Monthly Dropout Risk Summary - Nov 2025", data, ["Department", "Total Students", "At Risk", "High Risk", "Risk %"]);
    }
    if (type === "attendance") {
      const data = [
        { Dept: "CSE", Class: "3rd Year A", AvgAttendance: "78%", Below75: 18, Total: 60 },
        { Dept: "CSE", Class: "3rd Year B", AvgAttendance: "82%", Below75: 12, Total: 58 },
        { Dept: "ECE", Class: "2nd Year A", AvgAttendance: "71%", Below75: 25, Total: 62 },
      ];
      generateExcel("Department-wise Attendance Report", data);
    }
    if (type === "high-risk") {
      const data = [
        ["Rahul Sharma", "CSE21001", "High", "58%", "42%", "₹25,000", "9876543210"],
        ["Sneha Reddy", "ECE22005", "High", "61%", "55%", "₹15,000", "9876543240"],
        ["Arjun Mehta", "ME22015", "High", "64%", "48%", "₹18,000", "9876543270"],
      ];
      generatePDF("High-Risk Students List - November 2025", data, ["Name", "Roll No", "Risk Level", "Attendance", "Avg Marks", "Fees Due", "Phone"]);
    }
    if (type === "counselor-load") {
      const data = [
        { Counselor: "Dr. Anita Sharma", Department: "CSE", Assigned: 42, Max: 50, ActiveCases: 18 },
        { Counselor: "Prof. Rajesh Kumar", Department: "ECE", Assigned: 38, Max: 45, ActiveCases: 14 },
        { Counselor: "Ms. Priya Singh", Department: "ME", Assigned: 29, Max: 40, ActiveCases: 9 },
      ];
      generateExcel("Counselor Workload Report", data);
    }
  };

  const categories = ["all", "Risk Analysis", "Attendance", "Intervention", "Counselor", "Finance"];

  const filteredReports = selectedCategory === "all" 
    ? mockReports 
    : mockReports.filter(r => r.category === selectedCategory);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "2rem" }}>

        <Anavbar/>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1e293b" }}>
          <FiFileText style={{ display: "inline", marginRight: "12px", color: "#6366f1" }} />
          Downloadable Reports
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Generate and download professional reports for stakeholders, management & audits</p>
      </div>

      {/* Quick Generate Cards */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#1e293b" }}>
          <FiFilter style={{ display: "inline", marginRight: "8px" }} />
          Quick Generate Reports
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {[
            { title: "Monthly Risk Summary", icon: FiTrendingDown, color: "#ef4444", type: "risk-summary" },
            { title: "Attendance Report", icon: FiUsers, color: "#f59e0b", type: "attendance" },
            { title: "High-Risk Students List", icon: FiAlertCircle, color: "#dc2626", type: "high-risk" },
            { title: "Counselor Load Report", icon: FiUsers, color: "#6366f1", type: "counselor-load" },
          ].map((report, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -8 }}
              style={{ background: "white", padding: "1.8rem", borderRadius: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", cursor: "pointer", border: `2px solid ${report.color}20` }}
              onClick={() => generateReport(report.type)}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <report.icon size={42} style={{ color: report.color }} />
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "1rem 0 0.5rem" }}>{report.title}</h3>
                  <p style={{ color: "#64748b", margin: 0 }}>Click to generate instantly</p>
                </div>
                <motion.div whileHover={{ rotate: 360 }} style={{ background: report.color, color: "white", padding: "14px", borderRadius: "50%" }}>
                  <FiDownload size={24} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Report History */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
            <FiCalendar style={{ display: "inline", marginRight: "8px" }} />
            Previously Generated Reports
          </h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: "12px 20px", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "1rem" }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
            ))}
          </select>
        </div>

        <motion.div style={{ background: "white", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
          {filteredReports.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}>
              <FiFileText size={64} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p>No reports in this category yet</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Report Name", "Type", "Category", "Date", "Size", "Actions"].map(h => (
                    <th key={h} style={{ padding: "1.5rem 1rem", textAlign: "left", color: "#475569", fontWeight: 700 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <motion.tr key={report.id} whileHover={{ backgroundColor: "#f8fafc" }}>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <FiFileText size={20} style={{ color: "#6366f1" }} />
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>{report.title}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "6px 14px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600 }}>
                        {report.type}
                      </span>
                    </td>
                    <td style={{ padding: "1.5rem 1rem", color: "#64748b" }}>{report.category}</td>
                    <td style={{ padding: "1.5rem 1rem", color: "#64748b" }}>{new Date(report.date).toLocaleDateString("en-IN")}</td>
                    <td style={{ padding: "1.5rem 1rem", color: "#64748b" }}>{report.size}</td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        style={{ background: "#6366f1", color: "white", padding: "10px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}
                        onClick={() => generateReport(report.id === 1 ? "risk-summary" : report.id === 2 ? "attendance" : report.id === 3 ? "high-risk" : "counselor-load")}
                      >
                        <FiDownload /> Download Again
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ReportsDashboard;