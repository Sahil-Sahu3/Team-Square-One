import { useState, useEffect } from "react";
import { financeAPI, predictionAPI } from "../api/services";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const speak = (text) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    window.speechSynthesis.speak(u);
  }
};

export default function Earnings({ onBack, onAddIncome }) {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    financeAPI.getSummary().then(r => setSummary(r.data.data)).catch(() => {});
    financeAPI.getWeeklyReport().then(r => setWeekly(r.data.data)).catch(() => {});
    financeAPI.getTransactions().then(r => setTransactions(r.data.data)).catch(() => {});
    predictionAPI.getForecast().then(r => setForecast(r.data.data)).catch(() => {});
  }, []);

  const income  = summary?.totalIncome  || 850;
  const expense = summary?.totalExpense || 0;
  const profit  = income - expense;

  const DEMAND_COLOR = { HIGH: "#43A047", MEDIUM: "#FFA000", LOW: "#E53935" };
  const demandColor = DEMAND_COLOR[forecast?.prediction] || "#43A047";

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%" }}>
      {/* Header */}
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="title">Earnings</span>
        <button className="sound-btn" onClick={() => speak(`Today's earnings are ${income} rupees. Profit is ${profit} rupees.`)}>🔊</button>
      </div>

      <div style={{ padding: 16 }}>
        {/* Summary grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Income", value: `₹${income}`, color: "#43A047", bg: "#E8F5E9" },
            { label: "Expense", value: `₹${expense}`, color: "#E53935", bg: "#FFEBEE" },
            { label: "Profit", value: `₹${profit}`, color: profit >= 0 ? "#43A047" : "#E53935", bg: profit >= 0 ? "#E8F5E9" : "#FFEBEE" },
            { label: "Tomorrow", value: forecast?.prediction || "MEDIUM", color: demandColor, bg: demandColor + "22" },
          ].map(item => (
            <div key={item.label} style={{ background: item.bg, borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Demand prediction badge */}
        {forecast && (
          <div style={{ background: "white", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <div>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>AI DEMAND FORECAST</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: demandColor, marginTop: 2 }}>{forecast.prediction} DEMAND TOMORROW</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Stock adjustment: {forecast.recommendedStockIncrease}</div>
            </div>
            <div style={{ fontSize: 32 }}>{forecast.prediction === "HIGH" ? "📈" : forecast.prediction === "LOW" ? "📉" : "📊"}</div>
          </div>
        )}

        {/* Weekly chart */}
        {weekly.length > 0 && (
          <div style={{ background: "white", borderRadius: 14, padding: "14px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Weekly Report</div>
            <Bar
              data={{
                labels: weekly.map(w => w.week),
                datasets: [
                  { label: "Income", data: weekly.map(w => w.income), backgroundColor: "#43A04788" },
                  { label: "Expense", data: weekly.map(w => w.expense), backgroundColor: "#E5393588" },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { labels: { font: { size: 11 } } } }, scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } } }}
            />
          </div>
        )}

        {/* Recent transactions */}
        <div style={{ background: "white", borderRadius: 14, padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Recent Transactions</div>
          {transactions.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center", padding: "20px" }}>No transactions yet</div>
          ) : transactions.slice(0, 5).map(tx => (
            <div key={tx._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.category}</div>
                <div style={{ color: "#aaa", fontSize: 12 }}>{new Date(tx.timestamp).toLocaleDateString("en-IN")}</div>
              </div>
              <div style={{ fontWeight: 800, color: tx.type === "income" ? "#43A047" : "#E53935", fontSize: 15 }}>
                {tx.type === "income" ? "+" : "-"}₹{tx.amount}
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-green btn-full" style={{ marginTop: 16 }} onClick={onAddIncome}>
          + Add Income
        </button>
      </div>
    </div>
  );
}
