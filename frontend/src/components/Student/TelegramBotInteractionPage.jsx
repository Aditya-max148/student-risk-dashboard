import React from "react";
import { motion } from "framer-motion";
import SNavbar from "./SNavbar";
//import { useNavigate } from "react-router-dom";

// Mock data (replace with real API later)
const botStats = {
  totalMessages: 248,
  firstMessageDate: "12 Oct 2025",
  activeDays: 42,
  streak: 18,
  tasksCompleted: 37,
  attendanceImprovedBy: 28, // percentage points
  averageGradeIncrease: 22, // percentage points
  currentDropoutRisk: 12,   // reduced from ~65%
  previousDropoutRisk: 68,
  badges: ["Early Bird", "Task Master", "Comeback King", "100% Week"],
};

const openTelegramBot = () => {
  const telegramLink = "https://t.me/Unscrollbot";
  const tgProtocolLink = "tg://resolve?url=t.me/Unscrollbot";

  // Try to open via Telegram app first (works on mobile + desktop app)
  window.location.href = tgProtocolLink;

  // Fallback after 1 second: open in browser if app didn't catch it
  setTimeout(() => {
    window.open(telegramLink, "_blank");
  }, 1000);
};

function TelegramBotInteractionPage() {
  //const navigate = useNavigate();

  const riskReduction = 100 - botStats.currentDropoutRisk;
  const riskReducedBy = botStats.previousDropoutRisk - botStats.currentDropoutRisk;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <SNavbar/>
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg, #6366f1, #a855f7, #f97316)",
          color: "white",
          textAlign: "center",
          padding: "5rem 2rem",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ fontSize: "4.5rem", marginBottom: "1rem" }}
        >
          
        </motion.div>
        <motion.h1
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          style={{ fontSize: "3.2rem", fontWeight: 800, marginBottom: "1rem" }}
        >
          Your Telegram Bot Journey
        </motion.h1>
        <p style={{ fontSize: "1.6rem", opacity: 0.95 }}>
          See how chatting with our bot is changing your future
        </p>
      </motion.section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Key Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", margin: "3rem 0" }}>
          <StatCard
            icon=""
            title="Total Chats"
            value={botStats.totalMessages}
            subtitle="Messages with bot"
            color="#2563eb"
          />
          <StatCard
            icon=""
            title="Active Days"
            value={botStats.activeDays}
            subtitle="Days you used the bot"
            color="#7c3aed"
          />
          <StatCard
            icon=""
            title="Current Streak"
            value={botStats.streak}
            subtitle="Don’t break it!"
            color="#f97316"
            glow
          />
          <StatCard
            icon=""
            title="Tasks Completed"
            value={botStats.tasksCompleted}
            subtitle="Via bot reminders"
            color="#10b981"
          />
        </div>

        {/* Dropout Risk Reduction - Main Highlight */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          style={{
            background: "white",
            borderRadius: "2rem",
            padding: "3rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            textAlign: "center",
            margin: "4rem 0",
            border: "4px solid #10b981",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#1e293b" }}>
            Your Dropout Risk Dropped By
          </h2>

          <div style={{ position: "relative", display: "inline-block" }}>
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Background Circle */}
              <circle cx="150" cy="150" r="130" fill="none" stroke="#e2e8f0" strokeWidth="25" />
              {/* Progress Circle */}
              <motion.circle
                cx="150"
                cy="150"
                r="130"
                fill="none"
                stroke="#10b981"
                strokeWidth="25"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 130}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - riskReduction / 100) }}
                transition={{ duration: 2, ease: "easeOut" }}
                transform="rotate(-90 150 150)"
              />
              {/* Center Text */}
              <text x="150" y="140" textAnchor="middle" fontSize="60" fontWeight="800" fill="#10b981">
                {riskReducedBy}%
              </text>
              <text x="150" y="180" textAnchor="middle" fontSize="20" fill="#64748b">
                Reduced
              </text>
            </svg>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <p style={{ fontSize: "1.4rem", color: "#475569" }}>
              From <span style={{ fontWeight: 700, color: "#ef4444" }}>{botStats.previousDropoutRisk}%</span> → 
              Now only <span style={{ fontWeight: 700, color: "#10b981" }}>{botStats.currentDropoutRisk}%</span>
            </p>
            <p style={{ fontSize: "1.6rem", marginTop: "1rem", color: "#1e293b", fontWeight: 600 }}>
              You’re now in the <span style={{ color: "#10b981" }}>Safe Zone</span>
            </p>
          </div>
        </motion.div>

        {/* Academic Improvements */}
        <div style={{ margin: "4rem 0" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "3rem", color: "#1e293b" }}>
            Your Academic Growth
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <ImprovementCard
              title="Attendance"
              before="58%"
              after="86%"
              increase={botStats.attendanceImprovedBy}
              color="#8b5cf6"
            />
            <ImprovementCard
              title="Average Grades"
              before="C+"
              after="A-"
              increase={botStats.averageGradeIncrease}
              color="#f59e0b"
            />
          </div>
        </div>

        {/* Badges Earned */}
        <div style={{ margin: "5rem 0" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "3rem", color: "#1e293b" }}>
            Badges Earned via Bot
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
            {botStats.badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ rotate: -180, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "white",
                  padding: "1rem 2rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  boxShadow: "0 10px 20px rgba(251, 191, 36, 0.4)",
                  fontSize: "1.1rem",
                }}
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: "2rem",
            color: "white",
            margin: "4rem 0",
          }}
        >
          <h2 style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>
            Keep Chatting. Keep Winning.
          </h2>
          <p style={{ fontSize: "1.5rem", opacity: 0.9 }}>
            Every message with the bot is a step toward your success.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openTelegramBot}
            style={{
              marginTop: "2rem",
              background: "white",
              color: "#10b981",
              fontWeight: 700,
              padding: "1.2rem 3rem",
              borderRadius: "9999px",
              fontSize: "1.3rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Open Telegram Bot Now
          </motion.button>
        </motion.div>
      </div>

      <footer style={{ backgroundColor: "#1f2937", color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
        <p>Your bot is proud of you. Keep going!</p>
      </footer>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, subtitle, color, glow }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      style={{
        background: "white",
        padding: "2rem",
        borderRadius: "1.5rem",
        textAlign: "center",
        boxShadow: glow ? "0 0 30px rgba(249, 115, 22, 0.5)" : "0 10px 30px rgba(0,0,0,0.1)",
        border: glow ? "2px solid #f97316" : "none",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
      <h3 style={{ fontSize: "2.8rem", fontWeight: 800, color }}>{value}</h3>
      <p style={{ fontSize: "1.3rem", fontWeight: 600, color: "#1e293b" }}>{title}</p>
      <p style={{ color: "#64748b" }}>{subtitle}</p>
    </motion.div>
  );
}

function ImprovementCard({ title, before, after, increase, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        background: "white",
        padding: "2.5rem",
        borderRadius: "1.5rem",
        textAlign: "center",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", color: "#1e293b" }}>{title} Improved</h3>
      <div style={{ fontSize: "3rem", fontWeight: 800, color }}>
        +{increase}%
      </div>
      <div style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#64748b" }}>
        {before} → <span style={{ color, fontWeight: 700 }}>{after}</span>
      </div>
      <div style={{ marginTop: "1rem", color: "#10b981", fontWeight: 600 }}>
        Thanks to bot reminders & tasks
      </div>
    </motion.div>
  );
}

export default TelegramBotInteractionPage;