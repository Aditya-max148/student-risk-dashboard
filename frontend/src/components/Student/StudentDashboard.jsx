import React, { useState, useEffect } from "react";
import { Star, AlertCircle, Trophy } from "lucide-react";
import SNavbar from "./SNavbar";
import { useNavigate } from "react-router-dom";


export default function StudentDashboard() {
  const [name] = useState("Aditya");
  const [attendance] = useState(84);
  const [avgMarks] = useState(74);
  const [streak] = useState(6);
  const [risk, setRisk] = useState(22);
  const navigate = useNavigate();


  const alerts = [
    { text: "Missed Math class yesterday", type: "warning" },
    { text: "Fee pending: March installment", type: "urgent" },
  ];

  const achievements = [
    { title: "5-day streak", unlocked: true },
    { title: "Top Quiz Score", unlocked: false },
    { title: "Consistency Badge", unlocked: true },
  ];

 useEffect(() => {
  const base = 100 - attendance;
  const marksFactor = avgMarks < 60 ? 20 : avgMarks < 75 ? 10 : 0;
  setRisk(Math.min(100, Math.max(0, base + marksFactor)));
}, [attendance, avgMarks]);


  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: "Poppins", sans-serif;
        }

        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff, #ffe8ef);
          padding-bottom: 40px;
        }

        .wrapper {
          max-width: 1200px;
          display: flex;
          gap: 25px;
          margin: 30px auto;
          padding: 0 20px;
        }

        /* LEFT PANEL */
        .left-panel {
          width: 32%;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* RIGHT PANEL */
        .right-panel {
          width: 68%;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* CARD STYLE */
        .card {
          background: white;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0px 4px 14px rgba(0,0,0,0.12);
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .small-card {
          border: 1px solid #e5e5e5;
          padding: 12px;
          border-radius: 12px;
          background: #f9f9f9;
          display: flex;
          justify-content: space-between;
        }

        .alert-warning {
          background: #fff7c2;
          border: 1px solid #ffec8a;
        }

        .alert-urgent {
          background: #ffd6d6;
          border: 1px solid #ff9b9b;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .button-row {
          display: flex;
          gap: 15px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #e5e7eb;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>

      <div className="page-container">
        <SNavbar />

        <div className="wrapper">
          {/* LEFT PANEL */}
          <div className="left-panel">

            {/* Profile */}
            <div className="card">
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                Hello, {name} 👋
              </h2>
              <p style={{ marginTop: 6, color: "#666" }}>
                Your learning summary
              </p>
            </div>

            {/* QUICK STATS */}
            <div className="card">
              <div className="card-title">Quick Stats</div>

              <div className="small-card">
                <span>Risk Level</span>
                <strong>{risk}%</strong>
              </div>

              <div className="small-card">
                <span>Attendance</span>
                <strong>{attendance}%</strong>
              </div>

              <div className="small-card">
                <span>Average Marks</span>
                <strong>{avgMarks}%</strong>
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="card">
              <div className="card-title">
                <Star size={18} /> Achievements
              </div>

              {achievements.map((a, i) => (
                <div key={i} className="small-card">
                  <span>{a.title}</span>
                  <span>{a.unlocked ? "Unlocked" : "Locked"}</span>
                </div>
              ))}
            </div>

            {/* ALERTS */}
            <div className="card">
              <div className="card-title">
                <AlertCircle size={18} /> Alerts
              </div>

              {alerts.map((a, i) => (
                <div
                  key={i}
                  className={`small-card ${a.type === "urgent" ? "alert-urgent" : "alert-warning"
                    }`}
                >
                  {a.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="card">
              <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: 16 }}>
                Dashboard Overview
              </h2>

              <div className="grid">
                <div className="small-card">
                  <span>Performance Risk</span>
                  <strong>{risk}%</strong>
                </div>

                <div className="small-card">
                  <span>Attendance</span>
                  <strong>{attendance}%</strong>
                </div>

                <div className="small-card">
                  <span>Average Marks</span>
                  <strong>{avgMarks}%</strong>
                </div>

                <div className="small-card">
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Trophy size={16} /> Current Streak
                  </span>
                  <strong>{streak} days</strong>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="button-row">
              <button className="btn-primary" onClick={() => navigate("/ai-counsler")}>
                Open AI Counselor
              </button>
              <button className="btn-secondary">Start Study Plan</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
