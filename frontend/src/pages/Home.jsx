import { useState, useEffect } from "react";
import { financeAPI, predictionAPI } from "../api/services";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// Hard-coded demo alert to match screenshot
const DEMO_ALERT = "Road Closed Near Market Tomorrow";

export default function Home({ onNavigate }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [yesterday, setYesterday] = useState(720);

  useEffect(() => {
    financeAPI.getSummary().then(r => setSummary(r.data.data)).catch(() => {});
    predictionAPI.getForecast().then(r => setForecast(r.data.data)).catch(() => {});
  }, []);

  const todayEarnings = summary?.totalIncome || 850;
  const bestLocation = forecast?.prediction === "HIGH" ? "Railway Station" : "Market Area";
  const firstName = user?.name?.split(" ")[0] || "Ramesh";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "hi-IN";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%" }}>
      {/* Blue header */}
      <div style={{ background: "#1565C0", padding: "16px 20px 20px", borderRadius: "0 0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FFA000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 18 }}>
              {firstName[0]}
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>Namaste, {firstName}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{today}</div>
            </div>
          </div>
          <button className="sound-btn" onClick={() => speak(`Namaste ${firstName}. Today's earnings are ${todayEarnings} rupees.`)}>🔊</button>
        </div>

        {/* Earnings card */}
        <div style={{ background: "white", borderRadius: 20, padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>💰 Today's Earnings</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#1A1A1A", lineHeight: 1.1 }}>₹{todayEarnings.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Yesterday: ₹{yesterday.toLocaleString("en-IN")}</div>
          <button className="btn btn-green btn-full" style={{ marginTop: 14 }} onClick={() => onNavigate("addIncome")}>
            + Add Income
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Best Location card */}
        <div style={{ background: "#FFF8E1", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, border: "1px solid #FFE082" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, background: "#FFA000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📍</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Best Location Today</div>
              <div style={{ color: "#E65100", fontWeight: 800, fontSize: 15 }}>{bestLocation}</div>
            </div>
          </div>
          <button className="sound-btn" style={{ background: "#FFA000" }} onClick={() => speak(`Best location today is ${bestLocation}`)}>🔊</button>
        </div>

        {/* Alert card */}
        <div style={{ background: "#FFEBEE", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, border: "1px solid #FFCDD2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, background: "#E53935", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#C62828" }}>🔔 Alert</div>
              <div style={{ color: "#555", fontSize: 13 }}>{DEMO_ALERT}</div>
            </div>
          </div>
          <button className="sound-btn" style={{ background: "#E53935" }} onClick={() => speak(`Alert: ${DEMO_ALERT}`)}>🔊</button>
        </div>

        {/* Grid buttons */}
        <div className="grid-btns">
          <button className="grid-btn blue" onClick={() => onNavigate("zones")}>
            <span className="icon">📍</span>
            Where to Sell
          </button>
          <button className="grid-btn green" onClick={() => onNavigate("addIncome")}>
            <span className="icon">₹</span>
            Add Money
          </button>
          <button className="grid-btn orange" onClick={() => onNavigate("alerts")}>
            <span className="icon">🔔</span>
            Alerts
          </button>
          <button className="grid-btn purple" onClick={() => onNavigate("community")}>
            <span className="icon">👥</span>
            My Group
          </button>
        </div>
      </div>
    </div>
  );
}
