import { createContext, useContext, useState } from "react";
import { loginRequest } from "../services/authService";

// ==========================================================
// AuthContext
// Provides { admin, token, isAuthenticated, login, logout }
// to the whole app. Wrap <AppRoutes> with <AuthProvider>.
// ==========================================================

const AuthContext = createContext(null);

function readStoredAdmin() {
  try {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(readStoredAdmin);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  async function login(email, password) {
    const data = await loginRequest(email, password); // throws on invalid creds
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken(null);
    setAdmin(null);
  }

  function updateAdmin(patch) {
    setAdmin((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem("admin", JSON.stringify(next));
      return next;
    });
  }

  const value = {
    admin,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    updateAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
