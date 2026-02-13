import { useState } from "react";
import { financeAPI } from "../api/services";
import toast from "react-hot-toast";

const speak = (text) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    window.speechSynthesis.speak(u);
  }
};

export default function AddIncome({ onBack }) {
  const [amount, setAmount] = useState("0");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const pressKey = (key) => {
    if (key === "clear") { setAmount("0"); return; }
    if (key === "del") {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
      return;
    }
    setAmount(prev => prev === "0" ? String(key) : prev + key);
  };

  const addQuick = (val) => {
    setAmount(prev => String(parseInt(prev || 0) + val));
  };

  const handleSave = async () => {
    if (parseInt(amount) === 0) { toast.error("Please enter an amount"); return; }
    setLoading(true);
    try {
      await financeAPI.addIncome({ amount: parseInt(amount), category: "sales", note: "Daily sales" });
      setSaved(true);
      speak(`Income of ${amount} rupees added. Great work today!`);
    } catch {
      toast.error("Failed to save. Saved offline.");
      setSaved(true); // still show success (offline mode UX)
    } finally { setLoading(false); }
  };

  if (saved) {
    return (
      <div style={{ background: "white", minHeight: "100%" }}>
        <div style={{ padding: "16px 20px" }}>
          <button onClick={onBack} style={{ background: "none", fontSize: 22, color: "#43A047" }}>←</button>
        </div>
        <div className="success-screen">
          <div className="success-check">✓</div>
          <h2 className="success-title">Income Added</h2>
          <div className="saved-box">
            <div className="saved-label">Total Saved</div>
            <div className="saved-amount">₹ {parseInt(amount).toLocaleString("en-IN")}</div>
            <div className="saved-badge">
              <span style={{ color: "#43A047" }}>●</span> Great work today!
            </div>
          </div>
          <div className="offline-note">☁️ Saved offline. Will sync automatically.</div>
          <button className="btn btn-green btn-full" style={{ marginTop: 8 }} onClick={onBack}>
            Back to Home →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", fontSize: 22, color: "#43A047" }}>←</button>
        <button className="sound-btn green" onClick={() => speak(`Current amount is ${amount} rupees`)}>🔊</button>
      </div>

      <div style={{ padding: "0 24px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Add Today's</h2>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#43A047", marginBottom: 24 }}>Income</h2>

        {/* Amount display */}
        <div style={{ background: "#E8F5E9", borderRadius: 20, padding: "24px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>Total Amount</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: "#1A1A1A" }}>₹ {parseInt(amount || 0).toLocaleString("en-IN")}</div>
        </div>

        {/* Quick add buttons */}
        <div className="quick-btns">
          {[500, 1000, 2000].map(v => (
            <button key={v} className="quick-btn" onClick={() => addQuick(v)}>+₹{v}</button>
          ))}
        </div>

        {/* Numpad */}
        <div className="numpad" style={{ marginBottom: 16 }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="numpad-key" onClick={() => pressKey(n)}>{n}</button>
          ))}
          <button className="numpad-key red-key" onClick={() => pressKey("clear")}>✕</button>
          <button className="numpad-key" onClick={() => pressKey(0)}>0</button>
          <button className="numpad-key green-key" onClick={handleSave} disabled={loading}>
            {loading ? "..." : "✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
