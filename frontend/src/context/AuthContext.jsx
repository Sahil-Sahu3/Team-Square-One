import { createContext, useContext, useState } from "react";
import { authAPI } from "../api/services";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vv_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const login = async (phone, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ phone, password });
      setUser(data.data); localStorage.setItem("vv_user", JSON.stringify(data.data));
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message || "Login failed" }; }
    finally { setLoading(false); }
  };
  const register = async (name, phone, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, phone, password });
      setUser(data.data); localStorage.setItem("vv_user", JSON.stringify(data.data));
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message || "Registration failed" }; }
    finally { setLoading(false); }
  };
  const logout = () => { setUser(null); localStorage.removeItem("vv_user"); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
