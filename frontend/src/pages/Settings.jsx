import { useAuth } from "../context/AuthContext";

export default function Settings({ onBack }) {
  const { user, logout } = useAuth();
  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%" }}>
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="title">Settings</span>
        <div style={{ width: 38 }} />
      </div>
      <div style={{ padding: 16 }}>
        {/* Profile card */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FFA000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "white", margin: "0 auto 12px" }}>
            {user?.name?.[0] || "R"}
          </div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{user?.name}</div>
          <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>📞 {user?.phone}</div>
          <div style={{ background: "#E8F5E9", color: "#43A047", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-block", marginTop: 8 }}>Verified Vendor</div>
        </div>

        {[
          { icon: "🔊", label: "Voice Language", value: "Hindi" },
          { icon: "🌐", label: "App Language", value: "English" },
          { icon: "📍", label: "My City", value: "Delhi" },
          { icon: "🔔", label: "Notifications", value: "On" },
          { icon: "📶", label: "Offline Mode", value: "Enabled" },
        ].map(item => (
          <div key={item.label} style={{ background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontWeight: 600 }}>{item.label}</span>
            </div>
            <span style={{ color: "#888", fontSize: 13 }}>{item.value} ›</span>
          </div>
        ))}

        <button className="btn btn-full" style={{ background: "#FFEBEE", color: "#C62828", borderRadius: 12, marginTop: 8 }} onClick={logout}>
          🚪 Logout
        </button>
        <div style={{ textAlign: "center", color: "#ccc", fontSize: 12, marginTop: 20 }}>VendorVoice v1.0 · Built for India's Vendors</div>
      </div>
    </div>
  );
}
