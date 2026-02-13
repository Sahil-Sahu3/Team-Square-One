import { useState, useEffect } from "react";
import { zoneAPI } from "../api/services";
import toast from "react-hot-toast";

// Demo zones matching the Delhi map screenshot
const DEMO_ZONES = [
  { _id: "1", name: "Railway Station", city: "Delhi", capacity: 20, currentVendors: 5, coordinates: { lat: 28.6420, lng: 77.2210 }, color: "#43A047", distance: "5 mins away", isBest: true },
  { _id: "2", name: "Market", city: "Delhi", capacity: 15, currentVendors: 12, coordinates: { lat: 28.6300, lng: 77.2150 }, color: "#FFA000", distance: "12 mins away", isBest: false },
  { _id: "3", name: "Kirti Nagar", city: "Delhi", capacity: 25, currentVendors: 8, coordinates: { lat: 28.6580, lng: 77.1500 }, color: "#43A047", distance: "18 mins away", isBest: false },
];

const speak = (text) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    window.speechSynthesis.speak(u);
  }
};

export default function Zones({ onBack }) {
  const [view, setView] = useState("map"); // "map" | "list"
  const [zones, setZones] = useState(DEMO_ZONES);
  const [selected, setSelected] = useState(DEMO_ZONES[0]);
  const [checkedIn, setCheckedIn] = useState(null);

  useEffect(() => {
    zoneAPI.getAll().then(r => {
      if (r.data.data?.length) setZones([...DEMO_ZONES, ...r.data.data]);
    }).catch(() => {});
  }, []);

  const handleCheckIn = async (zone) => {
    try {
      await zoneAPI.checkIn({ zoneId: zone._id });
      setCheckedIn(zone._id);
      toast.success(`Checked in to ${zone.name}!`);
      speak(`Starting navigation to ${zone.name}. It is ${zone.distance}.`);
    } catch { toast.error("Demo mode: Navigation started!"); setCheckedIn(zone._id); speak(`Starting navigation to ${zone.name}.`); }
  };

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", fontSize: 22 }}>←</button>
        <div style={{ background: "#F0F4FF", borderRadius: 50, padding: "8px 16px", fontWeight: 700, fontSize: 13, color: "#1565C0" }}>WHERE TO SELL</div>
        <button className="sound-btn green" onClick={() => speak("Best location today is Railway Station, 5 minutes away.")}>🔊</button>
      </div>

      {/* View toggle */}
      <div style={{ padding: "12px 20px", display: "flex", gap: 8 }}>
        <button onClick={() => setView("list")} style={{ padding: "8px 20px", borderRadius: 50, fontWeight: 700, fontSize: 13, background: view === "list" ? "#1565C0" : "white", color: view === "list" ? "white" : "#555", border: "1px solid #ddd" }}>List</button>
        <button onClick={() => setView("map")} style={{ padding: "8px 20px", borderRadius: 50, fontWeight: 700, fontSize: 13, background: view === "map" ? "#43A047" : "white", color: view === "map" ? "white" : "#555", border: "1px solid #ddd" }}>Map View</button>
      </div>

      {view === "map" ? (
        <>
          {/* Map area */}
          <div style={{ flex: 1, background: "#E8EAF6", position: "relative", minHeight: 320, overflow: "hidden" }}>
            {/* Stylized map background */}
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #CFD8DC 0%, #ECEFF1 50%, #CFD8DC 100%)", position: "relative" }}>
              {/* Road lines */}
              <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                <line x1="0" y1="160" x2="390" y2="160" stroke="#BDBDBD" strokeWidth="3"/>
                <line x1="195" y1="0" x2="195" y2="320" stroke="#BDBDBD" strokeWidth="3"/>
                <line x1="0" y1="100" x2="390" y2="220" stroke="#BDBDBD" strokeWidth="2" strokeDasharray="8,4"/>
                <line x1="80" y1="0" x2="310" y2="320" stroke="#BDBDBD" strokeWidth="2" strokeDasharray="6,4"/>
              </svg>

              {/* Zone circles */}
              {zones.map((zone, i) => {
                const positions = [{ left: "45%", top: "35%" }, { left: "65%", top: "65%" }, { left: "20%", top: "28%" }];
                const pos = positions[i] || { left: "50%", top: "50%" };
                const isSelected = selected?._id === zone._id;
                return (
                  <div key={zone._id} onClick={() => setSelected(zone)}
                    style={{ position: "absolute", ...pos, transform: "translate(-50%,-50%)", cursor: "pointer" }}>
                    <div style={{ width: isSelected ? 100 : 80, height: isSelected ? 100 : 80, borderRadius: "50%", background: zone.color + "44", border: `3px solid ${zone.color}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                      <span style={{ fontSize: 18 }}>{i === 0 ? "🚉" : i === 1 ? "🏪" : "🌿"}</span>
                    </div>
                    {isSelected && (
                      <div style={{ position: "absolute", top: "50%", left: "110%", background: "white", borderRadius: 8, padding: "4px 10px", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transform: "translateY(-50%)" }}>
                        {zone.name.toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* User dot */}
              <div style={{ position: "absolute", left: "52%", top: "55%", transform: "translate(-50%,-50%)" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#1565C0", border: "3px solid white", boxShadow: "0 0 0 4px rgba(21,101,192,0.3)" }}/>
              </div>
            </div>
          </div>

          {/* Best place card */}
          {selected && (
            <div className="map-bottom">
              <div className="best-label">BEST PLACE</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div className="best-place">{selected.name}</div>
                  <div className="walk-info">🚶 {selected.distance}</div>
                </div>
                <div style={{ width: 44, height: 44, background: "#E8F5E9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📈</div>
              </div>
              <button className="btn btn-green btn-full" style={{ marginTop: 14, fontSize: 16, fontWeight: 800, letterSpacing: 0.5 }}
                onClick={() => handleCheckIn(selected)}>
                {checkedIn === selected._id ? "✓ CHECKED IN" : "START GOING ▶"}
              </button>
            </div>
          )}
        </>
      ) : (
        /* List view */
        <div style={{ padding: "0 16px" }}>
          {zones.map((zone) => {
            const avail = zone.capacity - zone.currentVendors;
            return (
              <div key={zone._id} style={{ background: "white", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12 }} onClick={() => { setSelected(zone); setView("map"); }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: zone.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📍</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{zone.name}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{zone.distance} · {avail} spots free</div>
                  <div style={{ height: 4, background: "#eee", borderRadius: 2, marginTop: 6 }}>
                    <div style={{ width: `${(zone.currentVendors / zone.capacity) * 100}%`, height: "100%", background: zone.color, borderRadius: 2 }}/>
                  </div>
                </div>
                {zone.isBest && <span style={{ background: "#E8F5E9", color: "#43A047", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 20 }}>BEST</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
