import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SNavbar from "./SNavbar";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌞 Good Morning!";
    if (hour < 17) return "🌤️ Good Afternoon!";
    return "🌙 Good Evening!";
  };

  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: `${getGreeting()} 👋 I'm your AI Student Counselor. How are you feeling today?`,
    },
  ]);

  const chatEndRef = useRef(null);

  // Emotion replies
  const emotionReplies = {
    stress: [
      "I sense you're feeling stressed. It's okay—take a moment and breathe. Want to tell me what triggered it?",
      "Stress can build up silently. I'm here with you. What’s worrying you today?",
    ],
    sadness: [
      "I'm sorry you're feeling low. You matter. Want to share what's on your mind?",
      "Feeling sad is natural. You're not alone—I'm here to listen.",
    ],
    anger: [
      "Looks like something made you upset. Let’s talk through it calmly.",
      "Anger comes from hurt or frustration. Want to tell me what happened?",
    ],
    anxiety: [
      "I understand that anxious feeling. Let’s slow down and talk step by step.",
      "Anxiety can feel heavy, but you're safe. What thoughts are bothering you?",
    ],
  };

  // Detect emotion
  const detectEmotion = (msg) => {
    const lower = msg.toLowerCase();

    if (lower.includes("stress") || lower.includes("overwhelm")) return "stress";
    if (lower.includes("sad") || lower.includes("alone")) return "sadness";
    if (lower.includes("angry") || lower.includes("irritated")) return "anger";
    if (lower.includes("anxiety") || lower.includes("nervous")) return "anxiety";

    return null;
  };

  // Predefined quick replies
  const predefinedReplies = {
    "📚 Feeling Overwhelmed": [
      "It’s okay to feel overwhelmed sometimes. Let's break things into smaller steps—what’s stressing you the most right now?",
      "Take a deep breath. You’re doing your best. Tell me what subject or task is troubling you?",
      "Overwhelming feelings usually mean your brain is overloaded. Let’s sort it out together!",
    ],
    "💼 Balancing Work & Studies": [
      "Balancing both can be tough. Maybe we can create a simple schedule together?",
      "You're working hard already. Which part feels harder—work time or study time?",
      "Let’s find a balance that doesn’t burn you out. What does your daily routine look like?",
    ],
    "❤️ Relationship Issues": [
      "Emotional issues can affect studies a lot. Want to share what happened?",
      "Relationships are complicated, but your mental peace matters too. I’m here to listen.",
      "You’re not alone. Talking about feelings can really help—what’s bothering you?",
    ],
    "😴 Trouble Concentrating": [
      "Lack of focus is common. Do you feel tired or distracted lately?",
      "Let’s try figuring out what’s affecting your concentration—sleep, stress, or something else?",
      "Small breaks and a calm mind help a lot. When do you notice concentration problems the most?",
    ],
    "🌱 Lack of Motivation": [
      "Motivation dips happen. Let’s try to understand what demotivates you.",
      "You don’t have to be productive all the time. What’s one small goal we can set today?",
      "Sometimes motivation grows after starting. What’s the first tiny step you can take?",
    ],
    "🤯 Exam Pressure": [
      "Exam pressure is completely normal. Let’s tackle it step by step—what subject is worrying you the most?",
      "You don’t have to be perfect; you just need progress. Want me to help you create a simple exam strategy?",
      "Remember: consistency beats cramming. Tell me what your exam schedule looks like—I’ll help you plan.",
    ],
    "📖 Study Planning Help": [
      "I’d be happy to help! Tell me your subjects, and I can help you create a clear, easy study plan.",
      "A good study plan works *with* your routine, not against it. What time of day do you focus best?",
      "Let’s create a simple and effective plan. How many hours can you study per day without feeling stressed?",
    ],
    "😔 Feeling Lonely": [
      "I'm really sorry you're feeling this way. You’re not alone—I'm here for you. Want to tell me what's on your mind?",
      "Loneliness can feel heavy, but talking helps. Is something making you feel disconnected lately?",
      "You matter, even on the days it feels like no one notices. I’m here to listen whenever you want to share.",
    ],
    "🔥 Want Motivation Tips": [
      "You don’t need big motivation—just small daily steps. Want a few easy routines to start with?",
      "Let’s boost your motivation! Tell me what goal you want to achieve—I’ll help you break it down.",
      "Motivation grows when you see small wins. Let’s set one tiny task you can complete today!",
    ],
  };

  // Sidebar suggestions
  const predefinedSuggestions = [
    { label: "📚 Feeling Overwhelmed", color: "#e0f2fe" },
    { label: "💼 Balancing Work & Studies", color: "#fef9c3" },
    { label: "❤️ Relationship Issues", color: "#fde2e2" },
    { label: "😴 Trouble Concentrating", color: "#ede9fe" },
    { label: "🌱 Lack of Motivation", color: "#dcfce7" },
    { label: "🤯 Exam Pressure", color: "#fee2e2" },
    { label: "📖 Study Planning Help", color: "#d1fae5" },
    { label: "😔 Feeling Lonely", color: "#f3e8ff" },
    { label: "🔥 Want Motivation Tips", color: "#ffe4e6" },
  ];

  // Main message sending logic
  const sendMessage = async (customMessage = null) => {
    const msg = customMessage || message;
    if (!msg.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: msg }]);
    setMessage("");
    setIsTyping(true);

    // Predefined quick replies
    if (predefinedReplies[msg]) {
      setTimeout(() => {
        const randomReply =
          predefinedReplies[msg][
            Math.floor(Math.random() * predefinedReplies[msg].length)
          ];
        setChatHistory((prev) => [...prev, { sender: "bot", text: randomReply }]);
        setIsTyping(false);
      }, 1200);
      return;
    }

    // Emotion detection
    const emotion = detectEmotion(msg);
    if (emotion) {
      const randomEmotionReply =
        emotionReplies[emotion][
          Math.floor(Math.random() * emotionReplies[emotion].length)
        ];

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: randomEmotionReply },
        ]);
        setIsTyping(false);
      }, 1500);

      return;
    }

    // Backend response
    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        message: msg,
      });

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: res.data.response },
        ]);
        setIsTyping(false);
      }, 1500);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Try again." },
      ]);
      setIsTyping(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div
      style={{
        marginRight: "26vh",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #f0f4ff, #fff7f7)",
        minHeight: "100vh",
        minWidth: "1200px",
      }}
    >
      <SNavbar />

      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "30px auto",
          gap: "20px",
        }}
      >

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: "0 0 30%",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#1e3a8a" }}>
            💡 Conversation Starters
          </h2>

          {predefinedSuggestions.map((sugg, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(sugg.label)}
              style={{
                display: "block",
                width: "100%",
                margin: "10px 0",
                padding: "15px",
                backgroundColor: sugg.color,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              {sugg.label}
            </motion.button>
          ))}

          <div
            style={{
              marginTop: "40px",
              padding: "15px",
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              fontSize: "0.9rem",
            }}
          >
            <strong>✨ Tips for Academic Success</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li>Set achievable study goals</li>
              <li>Balance study & relaxation</li>
              <li>Stay consistent, not perfect</li>
              <li>Ask for help when needed</li>
            </ul>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: "0 0 70%",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "15px",
              color: "#2563eb",
            }}
          >
            🎓 AI Student Counselor
          </h2>

          {/* Chat box */}
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              marginBottom: "20px",
              background: "#fafafa",
            }}
          >
            {chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: chat.sender === "user" ? 50 : -50,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: "flex",
                  justifyContent:
                    chat.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px",
                    borderRadius: "15px",
                    backgroundColor:
                      chat.sender === "user" ? "#2563eb" : "#e0f2fe",
                    color: chat.sender === "user" ? "#fff" : "#1e293b",
                    fontSize: "1rem",
                    lineHeight: "1.4",
                  }}
                >
                  {chat.text}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{
                  marginBottom: "10px",
                  fontStyle: "italic",
                  color: "#6b7280",
                }}
              >
                🤖 Typing…
              </motion.div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flexGrow: 1,
                padding: "15px",
                borderRadius: "25px",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                outline: "none",
              }}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage()}
              style={{
                marginLeft: "15px",
                padding: "12px 25px",
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "25px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ➤
            </motion.button>
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "0.8rem",
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            ⚠️ This AI Student Counselor provides guidance to help prevent
            dropout but is not a replacement for professional counseling.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Chatbot;
