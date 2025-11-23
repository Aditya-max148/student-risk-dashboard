import React from "react";
import { motion } from "framer-motion";
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
  const examData = data
    .filter((student) => student.exam_risk > 0)
    .map((student) => ({
      name: student.name,
      examRisk: parseFloat((student.exam_risk * 100).toFixed(2)),
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{
        padding: "24px",
        backgroundColor: "#111827", // Dark background for modern look
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        color: "#f3f4f6",
      }}
    >
      <h3 style={{ fontWeight: "700", marginBottom: "20px", color: "#facc15" }}>
        📚 Exam Risk Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={examData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{ fill: "#f3f4f6", fontSize: "14px" }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: "#f3f4f6", fontSize: "14px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "10px",
              border: "none",
              color: "#f3f4f6",
            }}
            itemStyle={{ color: "#facc15" }}
            formatter={(value) => `${value}% Risk`}
          />
          <Bar
            dataKey="examRisk"
            fill="#f59e0b" // Bright orange bar color
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ExamRiskChart;
