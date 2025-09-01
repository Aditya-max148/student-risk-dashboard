import React from "react";
 

const Filters = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>EduDashboard</h1>
        <nav style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ textDecoration: "none", fontWeight: "600" }}>
            Dashboard
          </a>
          <a href="/classes" style={{ textDecoration: "none" }}>
            Classes
          </a>
          <a href="/students" style={{ textDecoration: "none" }}>
            Students
          </a>
          <a href="/reports" style={{ textDecoration: "none" }}>
            Reports
          </a>
        </nav>
      </header>

      {/* Analytics Section */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>Class Analytics</h2>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Monitor class performance and student engagement
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Classes</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>24</p>
            <p style={{ color: "red" }}>↑ 2 this week</p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Average Attendance</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>87%</p>
            <p style={{ color: "red" }}>↑ 3% from last month</p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Average Score</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>78.5</p>
            <p style={{ color: "red" }}>↓ 2.1 from last month</p>
          </div>

          {/* Card 4 */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3>At Risk Students</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>12</p>
            <p style={{ color: "red" }}>Needs attention</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <select style={{ flex: 1 }}>
          <option>All Sections</option>
        </select>
        <select style={{ flex: 1 }}>
          <option>All Subjects</option>
        </select>
        <input type="date" style={{ flex: 1 }} defaultValue="2025-01-01" />
        <button style={{ backgroundColor: "#111827", color: "#fff" }}>
          Apply Filters
        </button>
      </section>

      {/* Charts + Quick Stats */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Chart */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#9ca3af",
          }}
        >
          Risk Distribution Chart <br /> (Chart will be rendered here)
        </div>

        {/* Quick Stats */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Quick Stats</h3>
          <p style={{ color: "red" }}>High Risk: 5 students</p>
          <p style={{ color: "red" }}>Medium Risk: 7 students</p>
          <p style={{ color: "red" }}>Low Risk: 156 students</p>
          <p>Total Students: 168</p>
        </div>
      </section>

      {/* Student Risk Assessment */}
      <section
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Student Risk Assessment</h3>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Student</th>
              <th>Section</th>
              <th>Attendance</th>
              <th>Average Score</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Smith (STU001)</td>
              <td>Section A</td>
              <td>65%</td>
              <td>72.5</td>
              <td style={{ color: "red" }}>High Risk</td>
              <td>👁️</td>
            </tr>
            <tr>
              <td>Emma Johnson (STU002)</td>
              <td>Section B</td>
              <td>78%</td>
              <td>69.2</td>
              <td style={{ color: "red" }}>Medium Risk</td>
              <td>👁️</td>
            </tr>
            <tr>
              <td>Michael Brown (STU003)</td>
              <td>Section A</td>
              <td>92%</td>
              <td>85.7</td>
              <td style={{ color: "red" }}>Low Risk</td>
              <td>👁️</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <button>Previous</button>
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>Next</button>
        </div>
      </section>
    </div>
  );
};

export default Filters;
