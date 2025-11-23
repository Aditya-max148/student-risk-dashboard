import React, { useState } from "react";
import { motion } from "framer-motion";
// Note: useNavigate is assumed to be available in the execution environment
// The use is kept for the Counselor and Student buttons
import { useNavigate } from "react-router-dom";


// Utility function to resolve environment links
function resolveLink(name, fallback) {
    try {
        if (typeof process !== "undefined" && process?.env?.[name]) {
            return process.env[name];
        }
    } catch {}

    if (typeof window !== "undefined") {
        try {
            if (window.REACT_APP?.[name]) return window.REACT_APP[name];
            if (window.__ENV__?.[name]) return window.__ENV__[name];
            if (window[name]) return window[name];
        } catch {}
    }

    return fallback;
}

const features = [
    {
        icon: (
            <motion.svg
                style={{ width: "40px", height: "40px", color: "#6366f1" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                {/* Icon: Data/Structure (like a cube) */}
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </motion.svg>
        ),
        title: "Intelligent Predictor",
        description: "Our engine analyzes key data to predict students at risk of dropping out."
    },
    {
        icon: (
            <motion.svg
                style={{ width: "40px", height: "40px", color: "#f97316" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
                {/* Icon: Hexagon/Challenge */}
                <circle cx="12" cy="12" r="10" />
                <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16H21.17" />
            </motion.svg>
        ),
        title: "Gamified Motivation",
        description: "Badges, points, and leaderboards turn learning into a fun challenge."
    },
    {
        icon: (
            <motion.svg
                style={{ width: "40px", height: "40px", color: "#10b981" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Icon: Shield */}
                <path d="M12 22s8-4 8-10V5a2 2 0 00-2-2H6a2 2 0 00-2 2v7c0 6 8 10 8 10z" />
            </motion.svg>
        ),
        title: "Proactive Challenges",
        description: "Actionable tasks help students improve attendance, grades, and finances."
    },
];

const DEFAULT_WHATSAPP = "https://wa.me/1234567890?text=Hello%20I%27m%20a%20student";
const DEFAULT_TELEGRAM = "https://t.me/Unscrollbot";

function LandingPage() {
    const navigate = useNavigate();
    
    // Resolve links using the utility function
    const WHATSAPP_LINK = resolveLink("REACT_APP_WHATSAPP_LINK", DEFAULT_WHATSAPP);
    const TELEGRAM_LINK = resolveLink("REACT_APP_TELEGRAM_LINK", DEFAULT_TELEGRAM);
    
    // FIX: Define the necessary bot information object.
    const botInfo = {
        whatsapp: {
            title: "Connect via WhatsApp",
            desc: "Start a chat with our DropoutRaksha bot for personalized support and reminders. It's fast and familiar!",
            link: WHATSAPP_LINK,
            actionLabel: "Start WhatsApp Chat"
        },
        telegram: {
            title: "Connect via Telegram",
            desc: "Access instant alerts, gamified challenges, and financial advice directly through the Telegram bot.",
            link: TELEGRAM_LINK,
            actionLabel: "Launch Telegram Bot"
        }
    };

    const [open, setOpen] = useState(false);
    // State to hold the key of the platform clicked ('whatsapp' or 'telegram')
    const [platform, setPlatform] = useState(null); 

    // FIX: Simplified handleOpen to take the platform key string
    function handleOpen(p) {
        setPlatform(p);
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setPlatform(null);
    }

    const mainContentWrapperStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem"
    };

    // Responsive styles for the CTA buttons container
    const ctaButtonContainerStyle = { 
        display: "flex", 
        gap: "1.5rem", 
        flexWrap: "wrap", 
        justifyContent: "center"
    };

    // Responsive styles for the Bot buttons container
    const botButtonContainerStyle = {
        display: "flex", 
        gap: "1rem", 
        maxWidth: "600px", 
        margin: "0 auto",
        // Ensure responsiveness on small screens
        '@media (max-width: 640px)': {
            flexDirection: 'column',
            maxWidth: '100%',
        }
    };


    return (
        <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
            {/* Tailwind CSS base styles would be assumed, using inline styles for color/layout */}

            {/* HERO SECTION */}
            <div style={mainContentWrapperStyle}>
                <motion.header
                    style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7, #f97316)",
                        color: "white",
                        borderRadius: "1rem",
                        textAlign: "center",
                        padding: "8rem 2rem",
                        marginTop: "2rem",
                        marginBottom: "4rem"
                    }}
                    initial={{ y: -250, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <motion.h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                        DropoutRaksha: Predict & Prevent Dropout 🚀
                    </motion.h1>

                    <motion.p style={{ fontSize: "1.5rem", marginBottom: "3rem" }}>
                        Empowering students through data-driven insights and motivational tools.
                    </motion.p>

                    <motion.a
                        href="#cta"
                        style={{
                            backgroundColor: "white",
                            color: "#6366f1",
                            fontWeight: "700",
                            padding: "1rem 2.5rem",
                            borderRadius: "9999px",
                            textDecoration: "none",
                            cursor: "pointer",
                            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
                            display: "inline-block" // Added for proper hover scaling
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Features
                    </motion.a>
                </motion.header>
            </div>

            {/* BUTTON SECTION (CTA) */}
            <div id="cta" style={{ ...mainContentWrapperStyle, marginBottom: "4rem" }}>
                <motion.section
                    style={{
                        background: "linear-gradient(90deg, #6366f1, #a855f7)",
                        color: "white",
                        borderRadius: "1rem",
                        textAlign: "center",
                        padding: "5rem 1rem"
                    }}
                >
                    <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                        Ready to Support Students? 🎓
                    </h2>
                    <p style={{ fontSize: "1.5rem", marginBottom: "3rem" }}>
                        Choose your role to access the relevant system dashboard.
                    </p>

                    <div style={ctaButtonContainerStyle}>
                        
                        <motion.button
                            style={{
                                backgroundColor: "white",
                                color: "#6366f1",
                                fontWeight: "700",
                                padding: "1rem 2.5rem",
                                borderRadius: "9999px",
                                border: "none",
                                cursor: "pointer"
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            // Navigate to a placeholder Admin path
                            onClick={() => navigate("/admin-login")}
                        >
                            Admin
                        </motion.button>

                        <motion.button
                            style={{
                                backgroundColor: "#6366f1",
                                color: "white",
                                fontWeight: "700",
                                padding: "1rem 2.5rem",
                                borderRadius: "9999px",
                                border: "none",
                                cursor: "pointer"
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/counselor-signup")} // Changed path for clarity
                        >
                            Counselor
                        </motion.button>

                        <motion.button
                            style={{
                                backgroundColor: "#10b981",
                                color: "white",
                                fontWeight: "700",
                                padding: "1rem 2.5rem",
                                borderRadius: "9999px",
                                border: "none",
                                cursor: "pointer"
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/slogin")} // Changed path for clarity
                        >
                            Student Profile
                        </motion.button>

                    </div>
                </motion.section>
            </div>

            {/* Bot Connect Section */}
            <div style={{ ...mainContentWrapperStyle, marginBottom: "4rem" }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7, #f97316)",
                        color: "white",
                        borderRadius: "1rem",
                        textAlign: "center",
                        padding: "8rem 2rem",
                    }}
                    data-testid="bot-connect-root"
                >
                    <h3 style={{ fontSize: "3.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>Student Support Bots</h3>
                    <p style={{ fontSize: "1.5rem", color: "rgba(255, 255, 255, 0.9)", marginBottom: "3rem" }}>
                        Chat with our bots for instant help, alerts, and simple tasks.
                    </p>


                    <div style={botButtonContainerStyle}>
                        {/* WhatsApp Button */}
                        <motion.button
                            onClick={() => handleOpen('whatsapp')}
                            style={{
                                flex: 1,
                                backgroundColor: "white",
                                color: "#16A34A", // WhatsApp Green for distinction
                                fontWeight: "700",
                                padding: "1rem 2.5rem",
                                borderRadius: "9999px",
                                textDecoration: "none",
                                cursor: "pointer",
                                border: "none",
                                boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 20px rgba(0, 0, 0, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Meet our WhatsApp Bot"
                            data-testid="whatsapp-btn"
                        >
                            Meet our WhatsApp Bot
                        </motion.button>


                        {/* Telegram Button */}
                        <motion.button
                            // FIX: Pass the platform key 'telegram' to handleOpen
                            onClick={() => handleOpen('telegram')}
                            style={{
                                flex: 1,
                                backgroundColor: "white",
                                color: "#2563EB", // Telegram Blue for distinction
                                fontWeight: "700",
                                padding: "1rem 2.5rem",
                                borderRadius: "9999px",
                                textDecoration: "none",
                                cursor: "pointer",
                                border: "none",
                                boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 20px rgba(0, 0, 0, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Meet our Telegram Bot"
                            data-testid="telegram-btn"
                        >
                            Meet our Telegram Bot
                        </motion.button>
                    </div>


                    {/* Modal for Bot Connection */}
                    {open && platform && botInfo[platform] && (
                        <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} role="dialog" aria-modal="true" data-testid="bot-modal">
                            <motion.div 
                                style={{ width: "100%", maxWidth: "28rem", background: "white", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        {/* FIX: Use botInfo[platform] instead of info[platform] */}
                                        <h4 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>{botInfo[platform].title}</h4>
                                        <p style={{ fontSize: "1rem", color: "#4B5563", marginTop: "0.5rem" }}>{botInfo[platform].desc}</p>
                                    </div>
                                    <button onClick={handleClose} style={{ color: "#9CA3AF", marginLeft: "0.75rem", cursor: "pointer", background: "none", border: "none", fontSize: "1.25rem" }} aria-label="Close modal">✕</button>
                                </div>


                                <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
                                    <a
                                        // FIX: Use botInfo[platform] instead of info[platform]
                                        href={botInfo[platform].link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "#4f46e5", color: "white", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 10px rgba(79, 70, 229, 0.4)" }}
                                        data-testid="open-chat-link"
                                        onClick={handleClose} // Close modal on link click
                                    >
                                        {/* FIX: Use botInfo[platform] instead of info[platform] */}
                                        {botInfo[platform].actionLabel}
                                    </a>


                                    <button onClick={handleClose} style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", background: "white", color: "#374151", cursor: "pointer", fontWeight: 600 }} data-testid="close-modal-btn">
                                        Close
                                    </button>
                                </div>


                                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "1rem" }}>Tip: To override links in non-Node environments, set a global (e.g. <code>window.REACT_APP_WHATSAPP_LINK</code> or <code>window.REACT_APP_TELEGRAM_LINK</code>) before your app mounts.</p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>


            {/* FEATURES SECTION */}
            <main id="features" style={{ ...mainContentWrapperStyle, padding: "6rem 1rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: "4rem" }}>How It Works ✨</h2>

                <motion.div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "2.5rem"
                    }}
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            style={{
                                background: "white",
                                borderRadius: "1.5rem",
                                padding: "2.5rem",
                                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                                border: "1px solid #e5e7eb"
                            }}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} // Added for better performance
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <div style={{ marginBottom: "1.5rem" }}>{f.icon}</div>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#4f46e5" }}>
                                {f.title}
                            </h3>
                            <p style={{ fontSize: "1rem", color: "#6b7280" }}>{f.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* FOOTER */}
            <footer
                style={{
                    backgroundColor: "#1f2937",
                    color: "white",
                    textAlign: "center",
                    padding: "2rem",
                    marginTop: "4rem"
                }}
            >
                © 2025 DropoutRaksha. Built with ❤️
            </footer>

             
        </div>
    );
}

export default LandingPage;