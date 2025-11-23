// GamificationPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SNavbar from "./SNavbar";

/* ---------------------------
   Mock static data (badges)
   --------------------------- */
const badgesData = [
  { id: 1, name: "Perfect Attendance", description: "Achieved 100% attendance this month.", icon: "🗓️", earned: true, color: "#10B981" },
  { id: 2, name: "Math Master", description: "Scored 90% or higher on the last three math exams.", icon: "💡", earned: true, color: "#F59E0B" },
  { id: 3, name: "Project Champion", description: "Completed all group project tasks on time.", icon: "🎯", earned: true, color: "#4F46E5" },
  { id: 4, name: "Reading Enthusiast", description: "Read more than 5 books this semester.", icon: "📚", earned: false, color: "#9CA3AF" },
  { id: 5, name: "Fee Payer", description: "Paid all fees on time.", icon: "💸", earned: false, color: "#EAB308" },
];

/* ---------------------------
   Motion variants
   --------------------------- */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.28 } } };
const badgeVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, rotate: 4, transition: { type: "spring", stiffness: 350, damping: 14 } },
  tap: { scale: 0.96 },
};

/* ---------------------------
   SVG medal components
   --------------------------- */
const MedalSVG = ({ color = "#FFD700", size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.25" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="8.5" r="4.5" fill={color} stroke="#b58b00" strokeWidth="0.4" />
    <path d="M12 13.5c-3 0-5.5 2.5-5.5 5v1h11v-1c0-2.5-2.5-5-5.5-5z" fill={color} opacity="0.95" />
    <rect x="7.5" y="2.2" width="3" height="6.2" rx="0.6" transform="rotate(-30 7.5 2.2)" fill="#fff" opacity="0.12" />
  </svg>
);

/* ---------------------------
   Helpers
   --------------------------- */
const medalForIndex = (i) => {
  if (i === 0) return <MedalSVG color="#FFD700" />; // gold
  if (i === 1) return <MedalSVG color="#C0C0C0" />; // silver
  if (i === 2) return <MedalSVG color="#CD7F32" />; // bronze
  return null;
};

// Simple deterministic color by name
const colorByName = (name) => {
  const palette = ["#ffd6e0", "#d3f8e2", "#e6e9ff", "#fff1d6", "#f0f5ff", "#ffe4f0", "#e8fff4"];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return palette[sum % palette.length];
};

// Avatar: initials with colored circle
const Avatar = ({ name, size = 40 }) => {
  const initials = (name || "U").split(" ").slice(0, 2).map(s => s.charAt(0)).join("").toUpperCase();
  const bg = colorByName(name || "user");
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, color: "#1f2937", fontSize: Math.floor(size / 2.5)
    }}>
      {initials}
    </div>
  );
};

/* ---------------------------
   Main component
   --------------------------- */
export default function GamificationPage() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [students, setStudents] = useState([]);
  const [goalText, setGoalText] = useState("");
  const [generatedGoals, setGeneratedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [minPoints, setMinPoints] = useState("");
  const [topN, setTopN] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Confirmation dialog for Message action
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Mock user progress values
  const userRank = 7;
  const userPoints = 985;
  const pointsToNextLevel = 1000;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch & normalize students
  const fetchRiskData = useCallback(async () => {
    try {
      const res = await axios.get("https://student-risk-dashboard.onrender.com/risk");
      const raw = Array.isArray(res.data) ? res.data : (res.data?.risk || []);
      const normalized = raw.map((s, i) => ({
        id: s.id ?? s._id ?? `s-${i}`,
        name: s.name ?? s.studentName ?? `Student ${i + 1}`,
        points: typeof s.points === "number" ? s.points : Number(s.points) || Math.max(0, 1000 - Math.floor(Math.random() * 600)),
        attendance: s.attendance ?? s.att ?? (Math.floor(Math.random() * 31) + 65), // fallback 65-95
        avgMarks: s.avgMarks ?? s.marks ?? (Math.floor(Math.random() * 31) + 60), // fallback 60-90
        avatar: s.avatar ?? s.avatarEmoji ?? null,
        bio: s.bio ?? null,
        ...s,
      }));
      setStudents(normalized);
    } catch (err) {
      console.error("Error fetching risk data:", err);
      // fallback mock list
      setStudents([
        { id: "s1", name: "Anita Sharma", points: 1120, attendance: 95, avgMarks: 91, avatar: null },
        { id: "s2", name: "Rahul Mehta", points: 980, attendance: 88, avgMarks: 80, avatar: null },
        { id: "s3", name: "Maya Rao", points: 860, attendance: 82, avgMarks: 76, avatar: null },
        { id: "s4", name: "Sahil Verma", points: 640, attendance: 70, avgMarks: 68, avatar: null },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchRiskData();
  }, [fetchRiskData]);

  const isMobile = windowWidth < 768;
  const progressPercentage = (userPoints / pointsToNextLevel) * 100;

  const getProgressColor = (percent) => {
    if (percent < 25) return "#EF4444";
    if (percent < 75) return "#F59E0B";
    return "#10B981";
  };

  /* Filters & sorting */
  const filteredAndSorted = useMemo(() => {
    const arr = students.slice();
    const q = search.trim().toLowerCase();
    let filtered = arr.filter(s => s.name.toLowerCase().includes(q));
    const min = Number(minPoints) || 0;
    if (min > 0) filtered = filtered.filter(s => (s.points || 0) >= min);
    filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
    if (topN > 0) filtered = filtered.slice(0, topN);
    return filtered;
  }, [students, search, minPoints, topN]);

  /* Open profile with detailed fields */
  const openProfile = (student, rank) => {
    setSelectedStudent({ ...student, rank });
    setProfileOpen(true);
  };
  const closeProfile = () => {
    setProfileOpen(false);
    setSelectedStudent(null);
  };

  /* Message flow: open confirm, then simulate send */
  const onMessageClick = () => setConfirmOpen(true);
  const confirmSendMessage = () => {
    setConfirmOpen(false);
    // simulate send (replace with API call)
    setTimeout(() => alert(`Message sent to ${selectedStudent?.name ?? "student"}`), 150);
  };

  /* AI Goals (kept safe like your previous implementation) */
  const generateAIProposals = async () => {
    if (!goalText) return;
    setIsLoading(true);
    setGeneratedGoals([]);
    try {
      const apiKey = ""; // supply key if available
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const systemPrompt = "Act as a friendly and encouraging academic advisor. Provide 3-5 goals in JSON array format.";
      const userQuery = `I want to improve my ${goalText}. Can you give me some goals?`;
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" },
      };
      const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        try { setGeneratedGoals(JSON.parse(jsonText)); } catch (e) { setGeneratedGoals([{ goal: "Generated", description: jsonText }]); }
      } else {
        setGeneratedGoals([{ goal: "Could not generate goals.", description: "Please try again." }]);
      }
      setIsModalOpen(true);
    } catch (err) {
      console.error("AI generation error:", err);
      setGeneratedGoals([{ goal: "Error", description: "Something went wrong." }]);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------
     Render
     --------------------------- */
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
      style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh", padding: isMobile ? 16 : 28, color: "#374151" }}>
      <SNavbar />

      <motion.h2 variants={itemVariants} style={{ fontSize: isMobile ? 22 : 34, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
        Your Student Journey 🚀
      </motion.h2>
      <motion.p variants={itemVariants} style={{ color: "#6b7280", marginBottom: 18, fontSize: 15 }}>
        Earn points, unlock badges, and climb the leaderboard!
      </motion.p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <input placeholder="Search student name..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", width: 220 }} />
        <input placeholder="Min points" type="number" value={minPoints} onChange={e => setMinPoints(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", width: 120 }} />
        <select value={topN} onChange={e => setTopN(Number(e.target.value))}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <option value={0}>All</option>
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
        </select>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ color: "#6b7280" }}>Your points:</div>
          <div style={{ fontWeight: 700, color: getProgressColor(progressPercentage) }}>{userPoints} pts</div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Leaderboard */}
        <motion.div variants={itemVariants} style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)", overflow: "hidden" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Leaderboard 🏆</h3>

          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: "70px 64px 1fr 100px", gap: 8, fontWeight: 600, color: "#6B7280", fontSize: 14, paddingBottom: 8, borderBottom: "1px solid #E5E7EB", marginBottom: 8 }}>
            <div>Rank</div>
            <div>Avatar</div>
            <div>Name</div>
            <div style={{ textAlign: "right" }}>Points</div>
          </div>

          {/* list */}
          <div>
            <AnimatePresence initial={false}>
              {filteredAndSorted.map((student, idx) => {
                const rank = idx + 1;
                const medal = medalForIndex(idx);
                return (
                  <motion.div key={student.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                    whileHover={{ scale: 1.01, backgroundColor: "#fbfdff" }}
                    transition={{ layout: { type: "spring", stiffness: 450, damping: 30 } }}
                    style={{
                      display: "grid", gridTemplateColumns: "70px 64px 1fr 100px", alignItems: "center", padding: "12px 0",
                      borderBottom: "1px solid #F3F4F6", gap: 8, cursor: "pointer", borderRadius: 8
                    }}
                    onClick={() => openProfile(student, rank)}
                  >
                    <div style={{ fontWeight: 700, color: idx < 3 ? "#4F46E5" : "#6B7280", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      {medal ?? rank}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {student.avatar ? (
                        // if avatar is a short emoji or string, show as is; if longer (url/object) show container
                        (typeof student.avatar === "string" && student.avatar.length <= 2) ? (
                          <div style={{ fontSize: 24 }}>{student.avatar}</div>
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {student.avatar ?? "👤"}
                          </div>
                        )
                      ) : <Avatar name={student.name} size={36} />}
                    </div>

                    <div style={{ fontWeight: 600, color: "#374151" }}>{student.name}</div>

                    <div style={{ textAlign: "right", fontWeight: 700, color: "#1D4ED8" }}>{student.points}</div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredAndSorted.length === 0 && <div style={{ padding: 14, color: "#6b7280" }}>No students found for the selected filters.</div>}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Progress */}
          <motion.div variants={itemVariants} style={{ background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>My Progress 📈</h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 20, color: getProgressColor(progressPercentage) }}>{userPoints}</span>
              <span style={{ color: "#6B7280", marginLeft: 8 }}>/ {pointsToNextLevel} Points</span>
            </div>
            <div style={{ height: 10, background: "#E5E7EB", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progressPercentage}%`, height: "100%", background: getProgressColor(progressPercentage), transition: "width 0.5s ease" }} />
            </div>
            <p style={{ color: "#6B7280", marginTop: 10, fontSize: 13 }}>You are ranked #{userRank}. Keep going!</p>
          </motion.div>

          {/* Badges */}
          <motion.div variants={itemVariants} style={{ background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>My Badges 🎖️</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 12 }}>
              {badgesData.map(b => (
                <motion.div key={b.id} layout variants={badgeVariants} initial="rest" whileHover="hover" whileTap="tap"
                  style={{
                    backgroundColor: b.earned ? "#F3F4F6" : "#E5E7EB",
                    borderRadius: 12, padding: 12, height: 84, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    border: `2px solid ${b.earned ? b.color : "#9CA3AF"}`, boxShadow: b.earned ? "0 6px 12px rgba(0,0,0,0.06)" : "none", opacity: b.earned ? 1 : 0.6, cursor: "pointer"
                  }}>
                  <div style={{ fontSize: 28 }}>{b.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 6 }}>{b.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* AI goal setter */}
      <motion.div variants={itemVariants} style={{ background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)", marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Personalized Goals ✨</h3>
        <p style={{ color: "#6b7280", marginBottom: 10 }}>Tell me what you want to improve, and I'll suggest some goals!</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input value={goalText} onChange={e => setGoalText(e.target.value)} placeholder="e.g., my math grade"
            style={{ flexGrow: 1, padding: 12, borderRadius: 8, border: "1px solid #d1d5db" }} />
          <motion.button onClick={generateAIProposals} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
            disabled={isLoading || !goalText}
            style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: isLoading ? "#9CA3AF" : "#4F46E5", color: "#fff", fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer" }}>
            {isLoading ? "Generating..." : "Generate Goals"}
          </motion.button>
        </div>
      </motion.div>

      {/* Goals modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{ background: "#fff", padding: 18, borderRadius: 12, width: "92%", maxWidth: 560 }}>
              <h4 style={{ margin: 0, marginBottom: 12, fontSize: 18 }}>Your Personalized Goals</h4>
              <div>
                {generatedGoals.map((g, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 8, background: "#f8fafc", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700 }}>{g.goal}</div>
                    <div style={{ color: "#6b7280" }}>{g.description}</div>
                  </div>
                ))}
                {generatedGoals.length === 0 && <div style={{ color: "#6b7280" }}>No goals generated yet.</div>}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={() => setIsModalOpen(false)} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700 }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile modal */}
      <AnimatePresence>
        {profileOpen && selectedStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 }}>
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} style={{ width: "92%", maxWidth: 520, background: "#fff", borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  {selectedStudent.avatar ? (typeof selectedStudent.avatar === "string" && selectedStudent.avatar.length <= 2 ? selectedStudent.avatar : selectedStudent.avatar) : <Avatar name={selectedStudent.name} size={56} />}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedStudent.name}</div>
                  <div style={{ color: "#6b7280", marginTop: 4 }}>Rank #{selectedStudent.rank} • {selectedStudent.points} points</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#4F46E5", fontSize: 18 }}>{/* SVG medal here for rank */}{medalForIndex(selectedStudent.rank - 1) ?? `#${selectedStudent.rank}`}</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: "8px 0" }}>About</h4>
                <p style={{ color: "#6b7280", marginTop: 0 }}>{selectedStudent.bio ?? "No bio available."}</p>

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <div style={{ flex: 1, padding: 12, borderRadius: 8, background: "#f8fafc" }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Attendance</div>
                    <div style={{ fontWeight: 700 }}>{selectedStudent.attendance ?? "—"}%</div>
                  </div>
                  <div style={{ flex: 1, padding: 12, borderRadius: 8, background: "#f8fafc" }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Avg Marks</div>
                    <div style={{ fontWeight: 700 }}>{selectedStudent.avgMarks ?? "—"}%</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4 style={{ margin: "8px 0" }}>Recent Activity</h4>
                  <ul style={{ color: "#6b7280", paddingLeft: 18 }}>
                    <li>Completed quiz — +25 pts</li>
                    <li>Attended extra lab session</li>
                    <li>Submitted project on time</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                <button onClick={onMessageClick} style={{ padding: "8px 12px", borderRadius: 8, background: "#06b6d4", color: "#fff", border: "none", fontWeight: 700 }}>Message</button>
                <button onClick={closeProfile} style={{ padding: "8px 12px", borderRadius: 8, background: "#e5e7eb", border: "none", fontWeight: 700 }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {confirmOpen && selectedStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ width: 320, background: "#fff", padding: 16, borderRadius: 12 }}>
              <h4 style={{ margin: 0, marginBottom: 8 }}>Send Message</h4>
              <div style={{ color: "#6b7280", marginBottom: 12 }}>Send a message to <strong>{selectedStudent.name}</strong>?</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setConfirmOpen(false)} style={{ padding: "8px 12px", borderRadius: 8, background: "#e5e7eb", border: "none" }}>Cancel</button>
                <button onClick={confirmSendMessage} style={{ padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "#fff", border: "none" }}>Yes, send</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 28 }}>
        © 2025 EduDash. All rights reserved. | Privacy | Terms | Support
      </div>
    </motion.div>
  );
}
