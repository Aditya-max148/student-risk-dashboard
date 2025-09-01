import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const navbarStyle = {
    backgroundColor: 'blue',
    text:'white',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  };

  const navLinksStyle = {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    margin: 0,
    padding: 4,
  };

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
    fontSize: '20px',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    transition: 'background-color 0.3s ease',
  };

  return (
     
    <nav style={navbarStyle}>
      <ul style={navLinksStyle}>
        <li>
            <p>📖</p>
        </li>
        <li>
          <Link to="/" style={linkStyle}>Home</Link>
        </li>
        <li>
          <Link to="/RiskDashboard" style={linkStyle}>Send Alert</Link>
        </li>
        <li>
          <Link to="/Dashboard" style={linkStyle}>Risk Dashboard</Link>
        </li>
         
      </ul>
    </nav>
  );
}

export default Navbar;