import { useState } from "react";

const MOCK_ALERTS = [
  { id: 1, type: "red", icon: "🔧", title: "Road Closed Near Market", sub: "Tomorrow 9 AM – 5 PM", urgent: true, btnType: "listen", btnText: "LISTEN TO ALERT", speech: "Urgent alert. Road closed near market tomorrow from 9 AM to 5 PM." },
  { id: 2, type: "yellow", icon: "🌧️", title: "Rain Expected", sub: "Carry plastic covers", urgent: false, btnType: "hear", btnText: "HEAR ADVICE", speech: "Rain is expected today. Please carry plastic covers to protect your goods." },
  { id: 3, type: "blue", icon: "⭐", title: "Local Festival", sub: "Extra crowd tomorrow", urgent: false, btnType: "read", btnText: "READ OUT LOUD", speech: "Local festival tomorrow. Expect extra crowd. Good opportunity to sell more." },
];

const speak = (text) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    window.speechSynthesis.speak(u);
  }
};

export default function Alerts({ onBack }) {
  const [hasAlerts] = useState(true); // toggle to false to see empty state

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%" }}>
      {/* Header */}
      <div className="app-header" style={{ borderRadius: "0 0 0 0" }}>
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="title">Alerts</span>
        <button className="sound-btn" onClick={() => speak("Alerts page. You have 3 alerts today.")}>🔊</button>
      </div>

      {!hasAlerts ? (
        /* Empty state — matches screenshot 1 */
        <div className="alerts-empty">
          <div className="shield-circle">
            <span className="shield-icon">🛡️</span>
            <div className="shield-check">✓</div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>No alerts for today</h2>
          <p style={{ color: "#555", fontSize: 14 }}>Everything looks safe.</p>
          <p style={{ color: "#43A047", fontWeight: 700, fontSize: 14 }}>You can sell normally.</p>
          <div className="dots">
            <div className="dot active" />
            <div className="dot" />
            <div className="dot" />
          </div>
          <button className="btn btn-green btn-full" style={{ marginTop: 16 }}>
            Go to Recommendations 📈
          </button>
        </div>
      ) : (
        /* Alerts list — matches screenshot 2 */
        <div style={{ padding: "16px 0 0" }}>
          {MOCK_ALERTS.map((alert) => (
            <div key={alert.id} className={`alert-card ${alert.type}`}>
              {alert.urgent && <div className="urgent-tag">URGENT</div>}
              <div className="alert-inner">
                <div className="alert-icon">{alert.icon}</div>
                <div>
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-sub">{alert.sub}</div>
                </div>
              </div>
              {alert.btnType === "listen" && (
                <button className="listen-btn" onClick={() => speak(alert.speech)}>
                  ▶ {alert.btnText}
                </button>
              )}
              {alert.btnType === "hear" && (
                <button className="hear-btn" onClick={() => speak(alert.speech)}>
                  🔊 {alert.btnText}
                </button>
              )}
              {alert.btnType === "read" && (
                <button className="read-btn" onClick={() => speak(alert.speech)}>
                  🔊 {alert.btnText}
                </button>
              )}
            </div>
          ))}

          {/* Your Vending Area map preview */}
          <div style={{ margin: "0 16px", background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ padding: "12px 16px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              📍 Your Vending Area
            </div>
            <div style={{ height: 120, background: "#E8EAF6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {/* Static map placeholder */}
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #C5CAE9 0%, #E8EAF6 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 28 }}>🗺️</div>
                <div style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Map View</div>
              </div>
              <div style={{ position: "absolute", width: 32, height: 32, background: "#1565C0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>👤</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
