import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
 

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/school', label: 'Classes' },
    { path: '/reports', label: 'Reports' },
    { path: '/notification', label: 'Notifications' },
    { path: '/ai-counsler', label: 'AI Counselor' },
  ];

  return (
    <>
      {/* Sticky Top Navbar */}
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
          boxShadow: scrolled 
            ? '0 10px 30px rgba(0,0,0,0.15)' 
            : '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
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
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 8 }}
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
            <span style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#1e293b',
            }}>
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
                        layoutId="adminActiveTab"
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
          </div>

           
        </div>

        {/* Mobile Menu - Horizontal Scrollable Pills */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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
            <div style={{
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto',
              padding: '0.5rem 0',
              scrollbarWidth: 'none',
            }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '0.6rem 1.3rem',
                      borderRadius: '9999px',
                      background: isActive 
                        ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                        : '#f1f5f9',
                      color: isActive ? 'white' : '#475569',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Spacer so content doesn't hide under navbar */}
      <div style={{ height: '80px' }} />

      {/* Hide scrollbar style */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

export default Navbar;