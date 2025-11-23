// AdminDataDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiDownload, FiEye, FiTrash2, FiX, FiCalendar, FiUsers, FiDollarSign, FiFileText, FiAlertCircle } from "react-icons/fi";
import Papa from "papaparse"; // For CSV parsing
import * as XLSX from "xlsx"; // FExcel parsingor 
import Anavbar from "./Anavbar";

function AdminDataDashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/data/all");
      const records = res.data?.data || res.data || [];
      setData(records);
      setFilteredData(records);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    let result = data;
    if (filterType !== "all") result = result.filter(d => d.type === filterType);
    if (searchTerm) {
      result = result.filter(item =>
        item.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date?.includes(searchTerm) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.filename?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredData(result);
  }, [searchTerm, filterType, data]);

  const getTypeIcon = (type) => {
    const icons = {
      attendance: <FiCalendar style={{ color: "#10b981" }} />,
      exam: <FiUsers style={{ color: "#8b5cf6" }} />,
      fees: <FiDollarSign style={{ color: "#f59e0b" }} />
    };
    return icons[type] || <FiFileText />;
  };

  const getTypeColor = (type) => {
    const colors = { attendance: "#10b981", exam: "#8b5cf6", fees: "#f59e0b" };
    return colors[type] || "#64748b";
  };

  // View file content (CSV/XLSX)
  const viewFile = async (record) => {
    setSelectedFile(record);
    setShowPreview(true);
    setFileContent(null);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/file/${record.stored_filename}`, {
        responseType: "blob"
      });

      const file = response.data;
      //const url = window.URL.createObjectURL(file);
      const fileExt = record.filename.split(".").pop().toLowerCase();

      if (fileExt === "csv") {
        const text = await file.text();
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            setFileContent(result.data.slice(0, 100)); // Show first 100 rows
          }
        });
      } else if (["xlsx", "xls"].includes(fileExt)) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setFileContent(json.slice(0, 100));
      }
    } catch (err) {
      console.error("Error loading file:", err);
      setFileContent(null);
    }
  };

  // Download file
  const downloadFile = async (record) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/file/${record.stored_filename}`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = record.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed!");
    }
  };

  // Delete file
  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`http://127.0.0.1:5000/delete/${id}`);
      fetchAllData(); // Refresh
    } catch (err) {
      alert("Delete failed!");
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ["Class", "Date", "Type", "File Name", "Upload Time"];
    const rows = filteredData.map(r => [
      r.className,
      r.date,
      r.type,
      r.filename,
      new Date(r.uploadedAt).toLocaleString()
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `records_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "2rem" }}>
      <Anavbar/>
      {/* Header & Stats same as before... */}
      {/* ... (keep your existing header and stats) */}

      {/* Filters */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: "14px", top: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by Class, Date, Type or File..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "14px 14px 14px 48px", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "1.1rem" }}
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: "14px 20px", borderRadius: "12px", border: "2px solid #e2e8f0", minWidth: "180px" }}>
          <option value="all">All Types</option>
          <option value="attendance">Attendance</option>
          <option value="exam">Exam/Grades</option>
          <option value="fees">Fees/Finance</option>
        </select>
        <motion.button whileHover={{ scale: 1.05 }} onClick={exportToCSV} style={{ background: "#6366f1", color: "white", padding: "14px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiDownload /> Export ({filteredData.length})
        </motion.button>
      </div>

      {/* Table */}
      <motion.div style={{ background: "white", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>Loading...</div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}>
            <FiFileText size={64} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p style={{ fontSize: "1.4rem" }}>No records found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Type", "Class", "Date", "File Name", "Uploaded At", "Actions"].map(h => (
                    <th key={h} style={{ padding: "1.5rem 1rem", textAlign: "left", color: "#475569", fontWeight: 700, borderBottom: "3px solid #e2e8f0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <motion.tr key={row._id} whileHover={{ backgroundColor: "#f8fafc" }} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {getTypeIcon(row.type)}
                        <span style={{ background: `${getTypeColor(row.type)}20`, color: getTypeColor(row.type), padding: "6px 12px", borderRadius: "999px", fontSize: "0.9rem", fontWeight: 600 }}>
                          {row.type}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", fontWeight: 600 }}>{row.className}</td>
                    <td style={{ padding: "1.2rem 1rem" }}>{new Date(row.date).toLocaleDateString("en-IN")}</td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <motion.span
                        whileHover={{ color: "#6366f1" }}
                        style={{ cursor: "pointer", fontWeight: 500, textDecoration: "underline" }}
                        onClick={() => window.open(`http://127.0.0.1:5000/file/${row.stored_filename}`, "_blank")}
                      >
                        {row.filename}
                      </motion.span>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", color: "#64748b" }}>
                      {new Date(row.uploadedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => viewFile(row)} title="Preview" style={{ background: "#e0e7ff", color: "#4338ca", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                          <FiEye size={18} />
                        </button>
                        <button onClick={() => downloadFile(row)} title="Download" style={{ background: "#dcfce7", color: "#166534", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                          <FiDownload size={18} />
                        </button>
                        <button
                          onClick={() => deleteFile(row._id)}
                          disabled={deletingId === row._id}
                          title="Delete"
                          style={{ background: "#fee2e2", color: "#991b1b", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}
                        >
                          {deletingId === row._id ? "..." : <FiTrash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: "1.5rem", width: "90%", maxWidth: "1000px", maxHeight: "90vh", overflow: "auto", position: "relative" }}
            >
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  <FiFileText style={{ display: "inline", marginRight: "10px" }} />
                  {selectedFile?.filename}
                </h3>
                <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <FiX size={28} />
                </button>
              </div>

              <div style={{ padding: "1.5rem" }}>
                {fileContent === null ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    <FiAlertCircle size={48} style={{ marginBottom: "1rem" }} />
                    <p>Loading file content...</p>
                  </div>
                ) : fileContent && fileContent.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {fileContent.slice(0, 20).map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            {Array.isArray(row) ? row.map((cell, j) => (
                              <td key={j} style={{ padding: "0.75rem", background: i === 0 ? "#f8fafc" : "white", fontWeight: i === 0 ? 700 : 400 }}>
                                {cell}
                              </td>
                            )) : Object.values(row).map((val, j) => (
                              <td key={j} style={{ padding: "0.75rem", background: i === 0 ? "#f8fafc" : "white" }}>
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {fileContent.length > 20 && <p style={{ textAlign: "center", color: "#64748b", marginTop: "1rem" }}>Showing first 20 rows</p>}
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "#ef4444" }}>Could not read file content</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDataDashboard;