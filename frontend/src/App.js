// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import RiskDashboard from "./components/RiskDashboard";
import Dashboard from "./components/Dashboard";
import StudentDetails from "./components/StudentDetails";
import Navbar from "./components/Navbar";

// AppContent is a new component that holds the main logic and routing
function AppContent() {
  
  

  // Use the useNavigate hook to programmatically navigate
  const navigate = useNavigate();

   const handleSendAlerts = () => {
    navigate('/sent-alerts');
  };

  const handleStudentdetails = () => {
    navigate('/student-details');
  };
  

  const handleFinalSubmit = () => {
    // Navigate to the '/dashboard' route
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: "20px" }}>
      <Routes>
        {/* Route for the main upload page */}
        <Route path="/" element={
          <>

            <Navbar/>
            <h1 style={{alignContent:"center"}}>Student Risk Dashboard</h1>
            <UploadForm
              dataType="attendance"
               
            />
            <UploadForm
              dataType="exam_results"
              
            />
            <UploadForm
              dataType="fee_payments"
               
            />
            <hr style={{ margin: "30px 0" }} />

            {/* Show the button only when all files are uploaded */}
            {(
              <button
                onClick={handleFinalSubmit}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Generate Risk Dashboard
              </button>
            )}


            {(
              <button
                onClick={handleSendAlerts}
                style={{
                  padding: "10px 20px",
                  margin:"20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "#4128a7ff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Sent Alert
              </button>
            )}

             
          </>
        } />
        {/* Route for the risk dashboard page */}
        <Route path="/dashboard" element={<RiskDashboard />} />
        <Route path="/sent-alerts" element={<Dashboard/>} />
        <Route path="/student-details" element={<StudentDetails/>} />
      </Routes>
    </div>
  );
}

// Wrap the AppContent in BrowserRouter for routing to work
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;