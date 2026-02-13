import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

// Pages
import Home       from "./pages/Home";
import Alerts     from "./pages/Alerts";
import Earnings   from "./pages/Earnings";
import AddIncome  from "./pages/AddIncome";
import Zones      from "./pages/Zones";
import Community  from "./pages/Community";
import Settings   from "./pages/Settings";
import { Login, Register } from "./pages/Auth";

// ─── Bottom Nav ───────────────────────────────
const NAV_ITEMS = [
  { id: "home",     icon: "⊞",  label: "Home" },
  { id: "alerts",   icon: "🔔", label: "Alerts" },
  { id: "earnings", icon: "₹",  label: "Earnings" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

function AppInner() {
  const { user } = useAuth();
  const [screen, setScreen] = useState("home");   // current screen
  const [authMode, setAuthMode] = useState("login");

  // Auth gate
  if (!user) {
    return authMode === "login"
      ? <Login onSwitchToRegister={() => setAuthMode("register")} />
      : <Register onSwitchToLogin={() => setAuthMode("login")} />;
  }

  // Which tab is "active" for the bottom nav highlight
  const activeTab = ["alerts", "earnings", "settings"].includes(screen) ? screen : "home";

  // Navigate helper — some screens are sub-screens (no bottom nav)
  const navigate = (s) => setScreen(s);
  const goBack   = ()   => setScreen("home");

  // ── Sub-screens (no bottom nav) ──────────────
  const SUB_SCREENS = {
    addIncome: <AddIncome onBack={goBack} />,
    zones:     <Zones     onBack={goBack} />,
    community: <Community onBack={goBack} />,
  };

  if (SUB_SCREENS[screen]) {
    return (
      <div className="app-shell">
        <div className="page-content" style={{ paddingBottom: 0 }}>
          {SUB_SCREENS[screen]}
        </div>
      </div>
    );
  }

  // ── Main screens (with bottom nav) ───────────
  const MAIN_SCREENS = {
    home:     <Home     onNavigate={navigate} />,
    alerts:   <Alerts   onBack={() => setScreen("home")} />,
    earnings: <Earnings onBack={() => setScreen("home")} onAddIncome={() => setScreen("addIncome")} />,
    settings: <Settings onBack={() => setScreen("home")} />,
  };

  return (
    <div className="app-shell">
      <div className="page-content">
        {MAIN_SCREENS[screen] || MAIN_SCREENS["home"]}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setScreen(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: 12, fontWeight: 600, fontSize: 14 },
          success: { style: { background: "#E8F5E9", color: "#2E7D32" } },
          error:   { style: { background: "#FFEBEE", color: "#C62828" } },
        }}
      />
      <AppInner />
    </AuthProvider>
  );
}
