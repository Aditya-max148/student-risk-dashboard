import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div style={{ backgroundColor: "#fff", padding: "10px 20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <div style={{ fontSize: "20px", fontWeight: "bold", cursor:"pointer" }}>
        <Link to="/">
        <img src="logo.png" alt="" width={40} height={40}/>
        </Link>
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center", fontSize: "14px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "10px 20px",

          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#007BFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/school"
            style={{
              textDecoration: "none",
              color: "#007BFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Class
          </Link>

          <Link
            to="/reports"
            style={{
              textDecoration: "none",
              color: "#007BFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reports
          </Link>

           
          <Link
            to="/notification"
            style={{
              textDecoration: "none",
              color: "#007BFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Notification
          </Link>

        </div>
 
      </div>
    </div>
  );
}

export default Navbar;