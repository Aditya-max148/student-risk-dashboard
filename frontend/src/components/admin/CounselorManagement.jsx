// CounselorManagement.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUsers, FiSave } from "react-icons/fi";
import Anavbar from "./Anavbar";

function CounselorManagement() {
  const [counselors, setCounselors] = useState([]);
  const [filteredCounselors, setFilteredCounselors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    location: "",
    maxStudents: 50,
    expertise: ""
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("counselors");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCounselors(parsed);
      setFilteredCounselors(parsed);
    }
  }, []);

  // Save to localStorage whenever counselors change
  useEffect(() => {
    localStorage.setItem("counselors", JSON.stringify(counselors));
    filterCounselors();
  }, [counselors, searchTerm]);

  const filterCounselors = () => {
    let filtered = counselors;
    if (searchTerm) {
      filtered = counselors.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCounselors(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCounselors(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c));
      setEditingId(null);
    } else {
      const newCounselor = {
        id: Date.now().toString(),
        ...formData,
        assignedStudents: 0,
        activeCases: Math.floor(Math.random() * 15),
        joinedDate: new Date().toISOString().split("T")[0]
      };
      setCounselors(prev => [...prev, newCounselor]);
    }
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", department: "", location: "", maxStudents: 50, expertise: "" });
    setEditingId(null);
  };

  const editCounselor = (counselor) => {
    setFormData(counselor);
    setEditingId(counselor.id);
    setShowForm(true);
  };

  const deleteCounselor = (id) => {
    if (window.confirm("Are you sure you want to remove this counselor?")) {
      setCounselors(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "2rem" }}>

      <Anavbar/>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1e293b" }}>
          <FiUsers style={{ display: "inline", marginRight: "12px", color: "#6366f1" }} />
          Counselor Management
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Manage counselors for student interventions (Stage 2 & 3)</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Counselors", value: counselors.length, color: "#6366f1" },
          { label: "Active Cases", value: counselors.reduce((a, c) => a + c.activeCases, 0), color: "#f59e0b" },
          { label: "Avg. Load", value: counselors.length > 0 ? Math.round(counselors.reduce((a, c) => a + c.assignedStudents, 0) / counselors.length) : 0, color: "#10b981" },
          { label: "Capacity Used", value: counselors.length > 0 ? Math.round((counselors.reduce((a, c) => a + c.assignedStudents, 0) / (counselors.reduce((a, c) => a + c.maxStudents, 0) || 1)) * 100) + "%" : "0%", color: "#ef4444" }
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} style={{ background: "white", padding: "1.5rem", borderRadius: "1.2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "0.5rem" }}>{stat.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Add Button */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: "14px", top: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search counselors by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "14px 14px 14px 48px", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "1.1rem" }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{ background: "#6366f1", color: "white", padding: "14px 28px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", fontWeight: 600 }}
        >
          <FiPlus /> Add Counselor
        </motion.button>
      </div>

      {/* Counselors Table */}
      <motion.div style={{ background: "white", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
        {filteredCounselors.length === 0 ? (
          <div style={{ padding: "6rem", textAlign: "center", color: "#94a3b8" }}>
            <FiUsers size={80} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p style={{ fontSize: "1.5rem" }}>No counselors added yet</p>
            <button onClick={() => setShowForm(true)} style={{ marginTop: "1rem", color: "#6366f1", fontWeight: 600 }}>Add your first counselor</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Counselor", "Contact", "Department", "Location", "Load", "Actions"].map(h => (
                    <th key={h} style={{ padding: "1.5rem 1rem", textAlign: "left", color: "#475569", fontWeight: 700, borderBottom: "3px solid #e2e8f0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCounselors.map((c) => (
                  <motion.tr key={c.id} whileHover={{ backgroundColor: "#f8fafc" }} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "48px", height: "48px", background: "#e0e7ff", color: "#4338ca", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                          {c.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>{c.name}</p>
                          <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>{c.expertise || "General Counseling"}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6366f1" }}><FiMail size={14} /> {c.email}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981" }}><FiPhone size={14} /> {c.phone}</div>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", fontWeight: 600 }}>{c.department}</td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b" }}>
                        <FiMapPin /> {c.location}
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.assignedStudents || 0} / {c.maxStudents} students</div>
                        <div style={{ background: "#e2e8f0", borderRadius: "8px", height: "8px", marginTop: "6px" }}>
                          <div style={{ background: c.assignedStudents / c.maxStudents > 0.8 ? "#ef4444" : c.assignedStudents / c.maxStudents > 0.6 ? "#f59e0b" : "#10b981", width: `${(c.assignedStudents / c.maxStudents) * 100}%`, height: "100%", borderRadius: "8px" }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => editCounselor(c)} style={{ background: "#e0e7ff", color: "#4338ca", padding: "10px", borderRadius: "8px" }}>
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => deleteCounselor(c.id)} style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "8px" }}>
                          <FiTrash2 size={16} />
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

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "1.5rem", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflow: "auto" }}>
              <div style={{ padding: "2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                  <FiUser style={{ display: "inline", marginRight: "10px" }} />
                  {editingId ? "Edit" : "Add New"} Counselor
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <FiX size={28} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                  <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                  <input required placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                  <input required placeholder="Department" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} style={{ padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                  <input required placeholder="Location / Room" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                  <input type="number" placeholder="Max Students" value={formData.maxStudents} onChange={e => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 50 })} style={{ padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                  <input placeholder="Expertise (e.g., Academic, Emotional)" value={formData.expertise} onChange={e => setFormData({ ...formData, expertise: e.target.value })} style={{ gridColumn: "1 / -1", padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0" }} />
                </div>
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: "14px 28px", borderRadius: "12px", border: "2px solid #e2e8f0", background: "white" }}>Cancel</button>
                  <motion.button whileHover={{ scale: 1.05 }} type="submit" style={{ background: "#6366f1", color: "white", padding: "14px 32px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FiSave /> {editingId ? "Update" : "Add"} Counselor
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CounselorManagement;