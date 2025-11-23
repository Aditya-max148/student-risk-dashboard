import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SNavbar from "./SNavbar";

const motivationalQuotes = [
  { text: "The pain of discipline is temporary. The pain of regret lasts forever.", author: "Unknown" },
  { text: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Every expert was once a beginner. Keep going.", author: "Helen Hayes" },
  { text: "Your current situation is not your final destination.", author: "Unknown" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "Dream big. Work hard. Stay focused. Never give up.", author: "DropoutRaksha" },
];

const successStories = [
  {
    name: "Priya Kumari",
    from: "Bihar → IIT Bombay",
    story: "Daughter of a daily wage worker. Studied under streetlights. Cracked JEE Advanced with AIR 842. Today she’s building AI for farmers.",
    image: "♀️",
  },
  {
    name: "Raju Meena",
    from: "Rajasthan Village → Google Engineer",
    story: "Failed Class 10 twice. No coaching. Self-studied from YouTube. Got placed at Google with 48 LPA package.",
    image: "♂️",
  },
  {
    name: "Anjali Sharma",
    from: "Failed Semester → Startup Founder",
    story: "Was about to drop out due to depression. Started coding at night. Built an edtech app now used in 200+ colleges.",
    image: "♀️",
  },
];

const motivationalVideos = [
  { title: "From Failure to IIT → Roman Saini (Unacademy Founder)", id: "n8MIMYD7YCtUa0fs" },
  { title: "I Was About to Drop Out – Then This Happened", id: "rB4w5eI5v8s" },
  { title: "How I Went From Failing to Topping College", id: "jF3k8mK9p2Q" },
];

function MotivationPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <SNavbar/>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg, #6366f1, #a855f7, #f97316)",
          color: "white",
          textAlign: "center",
          padding: "6rem 2rem",
        }}
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: "4rem", fontWeight: 800, marginBottom: "1.5rem" }}
        >
          You Are Not Alone
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: "1.8rem", maxWidth: "800px", margin: "0 auto", opacity: 0.95 }}
        >
          Thousands of students felt exactly like you do right now.  
          And they came back stronger.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          style={{ marginTop: "3rem", fontSize: "6rem" }}
        >
        </motion.div>
      </motion.section>

      {/* Motivational Quotes Carousel */}
      <section style={{ padding: "4rem 1rem", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "3rem", color: "#1e293b" }}>
            Words That Changed Lives
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {motivationalQuotes.map((quote, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  padding: "2rem",
                  borderRadius: "1.5rem",
                  textAlign: "center",
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                }}
              >
                <p style={{ fontSize: "1.4rem", fontStyle: "italic", marginBottom: "1rem" }}>
                  "{quote.text}"
                </p>
                <p style={{ fontWeight: 600 }}>- {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Success Stories */}
      <section style={{ padding: "6rem 1rem", backgroundColor: "#f1f5f9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", marginBottom: "4rem", color: "#1e293b" }}>
            They Almost Gave Up Too
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {successStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  background: "white",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <div style={{ padding: "2rem 1.5rem" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{story.image}</div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#6366f1" }}>{story.name}</h3>
                  <p style={{ color: "#f97316", fontWeight: 600, margin: "0.5rem 0" }}>{story.from}</p>
                  <p style={{ color: "#475569", lineHeight: "1.7", marginTop: "1rem" }}>
                    {story.story}
                  </p>
                </div>
                <div style={{ background: "#6366f1", color: "white", padding: "1rem", fontWeight: 600 }}>
                  They Didn’t Give Up. Neither Should You.
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Videos */}
      <section style={{ padding: "6rem 1rem", backgroundColor: "#0f172a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.8rem", marginBottom: "4rem", color: "white" }}>
            Watch Their Comeback Stories
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
            {motivationalVideos.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                style={{ borderRadius: "1rem", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
              >
                <iframe
                  width="100%"
                  height="240"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "1rem" }}
                ></iframe>
                <div style={{ padding: "1rem", background: "#1e293b", color: "white" }}>
                  <p style={{ fontWeight: 600 }}>{video.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", background: "linear-gradient(135deg, #10b981, #059669)" }}>
        <motion.h2
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          style={{ fontSize: "3.5rem", color: "white", marginBottom: "2rem" }}
        >
          Today Is Your Day 1
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: "1.8rem", color: "white", maxWidth: "700px", margin: "0 auto 3rem" }}
        >
          One small step today can change your entire future.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/student-dashboard")}
          style={{
            background: "white",
            color: "#10b981",
            fontWeight: "700",
            padding: "1.2rem 3rem",
            borderRadius: "9999px",
            fontSize: "1.3rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
          }}
        >
          I’m Ready to Fight Back
        </motion.button>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1f2937", color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
        <p>You are stronger than your struggles. Keep going. DropoutRaksha believes in you.</p>
      </footer>
    </div>
  );
}

export default MotivationPage;