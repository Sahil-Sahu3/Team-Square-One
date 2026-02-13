import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function Login({ onSwitchToRegister }) {
  const [form, setForm] = useState({ phone: "", password: "" });
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.phone, form.password);
    if (!res.success) toast.error(res.message);
  };

  return (
    <div style={{ background: "white", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#1565C0", padding: "40px 24px 60px", borderRadius: "0 0 40px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🛒</div>
        <h1 style={{ color: "white", fontSize: 28, fontWeight: 900, margin: 0 }}>VendorVoice</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: 8, fontSize: 14 }}>Empowering Every Street Vendor</p>
      </div>
      <div style={{ padding: 24, flex: 1 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, marginTop: 8 }}>Welcome Back 👋</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: 0.5 }}>PHONE NUMBER</label>
            <input type="tel" placeholder="e.g. 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: "100%", background: "#F5F5F5", borderRadius: 12, padding: "14px 16px", fontSize: 15, marginTop: 6, border: "1px solid #eee" }} required />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: 0.5 }}>PASSWORD</label>
            <input type="password" placeholder="Enter password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: "100%", background: "#F5F5F5", borderRadius: 12, padding: "14px 16px", fontSize: 15, marginTop: 6, border: "1px solid #eee" }} required />
          </div>
          <button type="submit" className="btn btn-green btn-full" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? "..." : "Login →"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "#888", fontSize: 14 }}>
          New vendor?{" "}
          <button onClick={onSwitchToRegister} style={{ background: "none", color: "#1565C0", fontWeight: 700 }}>Register here</button>
        </p>
      </div>
    </div>
  );
}

export function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form.name, form.phone, form.password);
    if (!res.success) toast.error(res.message);
  };

  return (
    <div style={{ background: "white", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#1565C0", padding: "40px 24px 60px", borderRadius: "0 0 40px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🛒</div>
        <h1 style={{ color: "white", fontSize: 28, fontWeight: 900, margin: 0 }}>VendorVoice</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: 8, fontSize: 14 }}>Join thousands of empowered vendors</p>
      </div>
      <div style={{ padding: 24, flex: 1 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, marginTop: 8 }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[["FULL NAME", "name", "text", "e.g. Ramesh Kumar"], ["PHONE NUMBER", "phone", "tel", "e.g. 9876543210"], ["PASSWORD", "password", "password", "6+ characters"]].map(([label, key, type, ph]) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: 0.5 }}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", background: "#F5F5F5", borderRadius: 12, padding: "14px 16px", fontSize: 15, marginTop: 6, border: "1px solid #eee" }} required />
            </div>
          ))}
          <button type="submit" className="btn btn-green btn-full" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? "..." : "Create Account →"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "#888", fontSize: 14 }}>
          Already registered?{" "}
          <button onClick={onSwitchToLogin} style={{ background: "none", color: "#1565C0", fontWeight: 700 }}>Login</button>
        </p>
      </div>
    </div>
  );
}
