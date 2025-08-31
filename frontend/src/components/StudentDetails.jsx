import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

function StudentDetails({ studentId, onClose }) {
  const [details, setDetails] = useState(null);

  

  useEffect(() => {
    if (studentId) {
      axios.get(`http://127.0.0.1:5000/student/${studentId}`)
        .then((res) => setDetails(res.data))
        .catch((err) => console.error("Error fetching details:", err));
    }
  }, [studentId]);

  if (!details) return <p>Loading student details...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1f2937', marginBottom: '2rem', marginTop: '1rem' }}>
        Student Performance Dashboard
      </h1>

      <div style={{ width: '100%', maxWidth: '64rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#374151' }}>Student Details</h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '0.5rem' }}>
            <strong>Student Name:</strong> {details.name}
          </p>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            <strong>Student ID:</strong> {details.student_id}
          </p>
        </div>

        {/* Attendance Trend Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem',
            }}
          >
            Attendance Trend
          </h3>
          <div
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              padding: '1rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={details.attendance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    borderColor: '#e5e7eb',
                    boxShadow:
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar
                  dataKey="present"
                  fill="url(#color3D)"
                  radius={[6, 6, 0, 0]} // Rounded top corners
                  barSize={30}
                />
                <defs>
                  {/* Gradient for a 3D effect */}
                  <linearGradient id="color3D" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Exam Performance Section */}
        <div>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem',
            }}
          >
            Exam Performance
          </h3>
          <div
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              padding: '1rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={details.exam_results}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="subject" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    borderColor: '#e5e7eb',
                    boxShadow:
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar
                  dataKey="score"
                  fill="url(#exam3D)"
                  radius={[8, 8, 0, 0]} // Rounded top
                  barSize={30}
                />
                <defs>
                  {/* Gradient for 3D look */}
                  <linearGradient id="exam3D" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
    /* <div
       style={{
         position: "fixed",
         top: "50%",
         left: "50%",
         transform: "translate(-50%, -50%)",
         background: "white",
         padding: "20px",
         borderRadius: "10px",
         boxShadow: "0 0 15px rgba(0,0,0,0.3)",
         zIndex: 1000,
         maxWidth: "800px",
         width: "90%"
       }}
     >
       <h3>Student Details: {details.name}</h3>
       <p><strong>ID:</strong> {details.student_id}</p>
 
       {/* Attendance Trend */
    /*<h4>Attendance Trend</h4>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={details.attendance}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="present" stroke="#09fc66ff" />
      </LineChart>
    </ResponsiveContainer>

{/* Exam Performance */
    /* <h4>Exam Scores</h4>
     <ResponsiveContainer width="100%" height={200}>
       <BarChart data={details.exam_results}>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="subject" />
         <YAxis />
         <Tooltip />
         <Legend />
         <Bar dataKey="score" fill="#1108c4ff" />
       </BarChart>
     </ResponsiveContainer>

{/* Fee Details */
    /*<h4>Fee Details</h4>
    <p><strong>Student Name:
    </strong> {details.name}</p>
    <p><strong>Amount Due:</strong> ₹{details.fees.amount_due}</p>
    <p><strong>Amount Paid:</strong> ₹{details.fees.amount_paid}</p>
    <p><strong>Due Date:</strong> {details.fees.due_date}</p>

    <button
      style={{
        background: "#333",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px"
      }}
      onClick={onClose}
    >
      Close
    </button>
  </div >*/
  );
}

export default StudentDetails;
