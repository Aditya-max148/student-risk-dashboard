// ClassDepartmentDashboard.jsx
import React, { useState,   } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiUsers, FiAlertTriangle, FiChevronRight,  FiPhone, FiTrendingDown, FiX } from "react-icons/fi";
import Anavbar from "./Anavbar";

const mockStudents = [
  // CSE Department
  { id: "1", name: "Rahul Sharma", roll: "CSE21001", dept: "Computer Science", class: "B.Tech CSE 3rd Year", section: "A", risk: "high", attendance: 58, marksAvg: 42, feesDue: 25000, phone: "9876543210", parentPhone: "9123456789", lastActive: "2 days ago" },
  { id: "2", name: "Priya Verma", roll: "CSE21015", dept: "Computer Science", class: "B.Tech CSE 3rd Year", section: "A", risk: "medium", attendance: 72, marksAvg: 68, feesDue: 0, phone: "9876543220", lastActive: "Today" },
  { id: "3", name: "Aman Kumar", roll: "CSE21028", dept: "Computer Science", class: "B.Tech CSE 3rd Year", section: "B", risk: "low", attendance: 88, marksAvg: 85, feesDue: 0, phone: "9876543230", lastActive: "Today" },
  // ECE Department
  { id: "4", name: "Sneha Reddy", roll: "ECE22005", dept: "Electronics & Comm.", class: "B.Tech ECE 2nd Year", section: "A", risk: "high", attendance: 61, marksAvg: 55, feesDue: 15000, phone: "9876543240", lastActive: "4 days ago" },
  { id: "5", name: "Vikram Singh", roll: "ECE22018", dept: "Electronics & Comm.", class: "B.Tech ECE 2nd Year", section: "B", risk: "medium", attendance: 69, marksAvg: 60, feesDue: 8000, phone: "9876543250", lastActive: "1 day ago" },
  // Mechanical
  { id: "6", name: "Rohan Patel", roll: "ME23012", dept: "Mechanical Engg.", class: "B.Tech ME 1st Year", section: "A", risk: "low", attendance: 92, marksAvg: 88, feesDue: 0, phone: "9876543260", lastActive: "Today" },
];

function ClassDepartmentDashboard() {
  const [students] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const departments = [...new Set(students.map(s => s.dept))];
  const classes = selectedDept === "all" 
    ? [...new Set(students.map(s => s.class))]
    : [...new Set(students.filter(s => s.dept === selectedDept).map(s => s.class))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || s.dept === selectedDept;
    const matchesClass = selectedClass === "all" || s.class === selectedClass;
    return matchesSearch && matchesDept && matchesClass;
  });

  const getRiskColor = (risk) => {
    return risk === "high" ? "#ef4444" : risk === "medium" ? "#f59e0b" : "#10b981";
  };

  const getRiskBg = (risk) => {
    return risk === "high" ? "#fee2e2" : risk === "medium" ? "#fef3c7" : "#dcfce7";
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "2rem" }}>

        <Anavbar/>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1e293b" }}>
          <FiUsers style={{ display: "inline", marginRight: "12px", color: "#6366f1" }} />
          Department & Class View
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Monitor students by department and class with real-time risk insights</p>
      </div>

      {/* Filters */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", marginBottom: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: "14px", top: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search student name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "14px 14px 14px 48px", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "1.1rem" }}
          />
        </div>

        <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedClass("all"); }} style={{ padding: "14px 20px", borderRadius: "12px", border: "2px solid #e2e8f0" }}>
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ padding: "14px 20px", borderRadius: "12px", border: "2px solid #e2e8f0" }}>
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={{ background: "#6366f1", color: "white", padding: "14px 24px", borderRadius: "12px", textAlign: "center", fontWeight: 600 }}>
          {filteredStudents.length} Students
        </div>
      </div>

      {/* Department Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.5rem" }}>
        {[...new Set(filteredStudents.map(s => s.dept))].map(dept => {
          const deptStudents = filteredStudents.filter(s => s.dept === dept);
          const highRisk = deptStudents.filter(s => s.risk === "high").length;

          return (
            <motion.div key={dept} whileHover={{ y: -8 }} style={{ background: "white", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>{dept}</h3>
                <p style={{ opacity: 0.9, margin: "8px 0 0" }}>{deptStudents.length} students • {highRisk > 0 && <><FiAlertTriangle style={{ display: "inline" }} /> {highRisk} high-risk</>}</p>
              </div>

              {/* Class Tabs */}
              <div style={{ padding: "1rem" }}>
                {[...new Set(deptStudents.map(s => s.class))].map(cls => {
                  const classStudents = deptStudents.filter(s => s.class === cls);
                  return (
                    <div key={cls} style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                        onClick={() => setSelectedClass(prev => prev === cls ? "all" : cls)}>
                        <span>{cls.split(" ")[1]} {cls.split(" ").slice(2).join(" ")}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span>{classStudents.length} students</span>
                          <FiChevronRight style={{ transition: "transform 0.2s"  ,transform: selectedClass === cls ? "rotate(90deg)" : "rotate(0)" }} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedClass === cls && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            {classStudents.map(student => (
                              <motion.div
                                key={student.id}
                                whileHover={{ backgroundColor: "#f1f5f9" }}
                                style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}
                                onClick={() => setSelectedStudent(student)}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div>
                                    <p style={{ fontWeight: 600, margin: 0 }}>{student.name}</p>
                                    <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "4px 0 0" }}>{student.roll} • Sec {student.section}</p>
                                  </div>
                                  <div style={{ textAlign: "right" }}>
                                    <span style={{ background: getRiskBg(student.risk), color: getRiskColor(student.risk), padding: "6px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                                      {student.risk.toUpperCase()} RISK
                                    </span>
                                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                                      Att: {student.attendance}% • Marks: {student.marksAvg}%
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setSelectedStudent(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "1.5rem", width: "90%", maxWidth: "500px", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>Student Profile</h3>
                <button onClick={() => setSelectedStudent(null)}><FiX size={28} /></button>
              </div>

              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ width: "100px", height: "100px", background: "#e0e7ff", color: "#4338ca", borderRadius: "50%", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700 }}>
                  {selectedStudent.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h4 style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>{selectedStudent.name}</h4>
                <p style={{ color: "#64748b" }}>{selectedStudent.roll} • {selectedStudent.class} • Sec {selectedStudent.section}</p>
                <span style={{ background: getRiskBg(selectedStudent.risk), color: getRiskColor(selectedStudent.risk), padding: "8px 16px", borderRadius: "999px", fontWeight: 600 }}>
                  {selectedStudent.risk.toUpperCase()} RISK
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "1rem" }}>
                <div><strong>Attendance:</strong> {selectedStudent.attendance}% {selectedStudent.attendance < 75 && <FiTrendingDown style={{ color: "#ef4444", display: "inline", marginLeft: "8px" }} />}</div>
                <div><strong>Avg Marks:</strong> {selectedStudent.marksAvg}%</div>
                <div><strong>Fees Due:</strong> ₹{selectedStudent.feesDue.toLocaleString()}</div>
                <div><strong>Last Active:</strong> {selectedStudent.lastActive}</div>
                <div><FiPhone /> {selectedStudent.phone}</div>
                <div><FiPhone style={{ color: "#ef4444" }} /> Parent: {selectedStudent.parentPhone}</div>
              </div>

              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <button style={{ flex: 1, background: "#6366f1", color: "white", padding: "14px", borderRadius: "12px", fontWeight: 600 }}>Assign Counselor</button>
                <button style={{ flex: 1, background: "#10b981", color: "white", padding: "14px", borderRadius: "12px", fontWeight: 600 }}>Send Alert</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClassDepartmentDashboard;