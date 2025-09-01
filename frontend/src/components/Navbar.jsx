import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div style={{ backgroundColor: "#fff", padding: "10px 20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>EduDash</div>
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
            School
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
            to="/filters"
            style={{
              textDecoration: "none",
              color: "#007BFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Filter
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
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#ccc" }}></div>
      </div>
    </div>
  );
}

export default Navbar;