import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ExamRiskChart = ({ data }) => {
  // Prepare chart data
  const examData = data
    .filter((student) => student.exam_risk > 0)
    .map((student) => ({
      name: student.name,
      examRisk: (student.exam_risk * 100).toFixed(2), // Directly use exam_risk
    }));

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Exam Risk</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={examData}
          margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* ✅ X-axis shows student names */}
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={70}
          />
          {/* ✅ Y-axis shows percentage */}
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => `${value}% Risk`} />
          <Bar
            dataKey="examRisk"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            style={{
              filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.2))",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExamRiskChart;
