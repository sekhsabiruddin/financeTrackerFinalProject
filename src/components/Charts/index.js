import React from "react";
import "./style.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ChartComponent = ({ sortedTransaction }) => {
  const data = sortedTransaction.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  return (
    <div className="charts-wrapper">
      <h4>Your Analytics</h4>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="green" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
