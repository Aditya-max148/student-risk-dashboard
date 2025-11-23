import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
 

function Anavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
  { path: "/admin", label: "Dashboard" },
  { path: "/upload", label: "Upload Data" },
  { path: "/classs-management", label: "Classes & Depts" },
  { path: "/counsler-management", label: "Counselors" },
  { path: "/reports-dashboard", label: "Reports" },
  { path: "/settings", label: "Settings" },
];


  return (
    <>
      {/* Sticky Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}>
          {/* Logo */}
          <Link to="/student-dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #f97316)',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              D
            </motion.div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>
              Dropout<span style={{ color: '#6366f1' }}>Raksha</span>
            </span>
          </Link>

          {/* Desktop: Horizontal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hidden md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      position: 'relative',
                      padding: '8px 0',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#6366f1' : '#475569',
                      fontSize: '1.05rem',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbarActive"
                        style={{
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}

            {/* Telegram Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "tg://resolve?url=t.me/Unscrollbot";
                setTimeout(() => window.open("https://t.me/Unscrollbot", "_blank"), 1200);
              }}
              style={{
                background: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              }}
            >
              Bot
            </motion.button>
          </div>

          {/* Mobile: Hamburger 
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{ fontSize: '28px', color: '#333' }}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>*/}
        </div>

        {/* Mobile Menu — Now HORIZONTAL when open */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '70px',
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid #e2e8f0',
              padding: '1rem 1.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }}
            className="md:hidden"
          >
            {/* Horizontal Scrollable Links */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              padding: '0.5rem 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="hide-scrollbar"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      background: isActive ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                      color: isActive ? 'white' : '#475569',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '1rem',
                      minWidth: 'fit-content',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  window.location.href = "tg://resolve?url=t.me/Unscrollbot";
                  setTimeout(() => window.open("https://t.me/Unscrollbot", "_blank"), 1200);
                  setMenuOpen(false);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '9999px',
                  background: '#2563eb',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Bot
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Spacer */}
      <div style={{ height: '80px' }} />
      
      {/* Hide scrollbar but allow scrolling */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

export default Anavbar;