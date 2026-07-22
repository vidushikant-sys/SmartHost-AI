import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getPreferences, updatePreferences } from "../services/authService";
import { useAuth } from "./AuthContext";

// ==========================================================
// ThemeContext
// Provides { accent, mode, setAccent, setMode, ACCENTS } to the
// whole app. Wrap <App> with <ThemeProvider>. Applies CSS
// variables on the document root so every page (which already
// styles itself with var(--primary), var(--background) etc.)
// automatically re-colors — no per-page changes needed.
// ==========================================================

const ThemeContext = createContext(null);

const ACCENT_KEY = "smarthost_accent";
const MODE_KEY = "smarthost_mode";

// Color presets. Each accent defines the primary brand color
// used for buttons, links, active nav items, chart accents, etc.
export const ACCENTS = {
  blue: {
    label: "Blue",
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    primaryLight: "#DBEAFE",
    swatch: "#2563EB",
  },
  green: {
    label: "Green",
    primary: "#16A34A",
    primaryDark: "#15803D",
    primaryLight: "#DCFCE7",
    swatch: "#16A34A",
  },
  black: {
    label: "Black",
    primary: "#171717",
    primaryDark: "#000000",
    primaryLight: "#E5E5E5",
    swatch: "#171717",
  },
  purple: {
    label: "Purple",
    primary: "#7C3AED",
    primaryDark: "#6D28D9",
    primaryLight: "#EDE9FE",
    swatch: "#7C3AED",
  },
  red: {
    label: "Red",
    primary: "#DC2626",
    primaryDark: "#B91C1C",
    primaryLight: "#FEE2E2",
    swatch: "#DC2626",
  },
  orange: {
    label: "Orange",
    primary: "#EA580C",
    primaryDark: "#C2410C",
    primaryLight: "#FFEDD5",
    swatch: "#EA580C",
  },
};

const LIGHT_BASE = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1E293B",
  textLight: "#64748B",
  border: "rgba(15,23,42,0.08)",
};

const DARK_BASE = {
  background: "#0B1120",
  surface: "#111827",
  text: "#E5E7EB",
  textLight: "#94A3B8",
  border: "rgba(255,255,255,0.08)",
};

function applyTheme(accentKey, mode) {
  const accent = ACCENTS[accentKey] || ACCENTS.blue;
  const base = mode === "dark" ? DARK_BASE : LIGHT_BASE;
  const root = document.documentElement.style;

  root.setProperty("--primary", accent.primary);
  root.setProperty("--primary-dark", accent.primaryDark);
  root.setProperty("--primary-light", accent.primaryLight);

  root.setProperty("--background", base.background);
  root.setProperty("--white", base.surface);
  root.setProperty("--text", base.text);
  root.setProperty("--text-light", base.textLight);
  root.setProperty("--border-color", base.border);

  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.setAttribute("data-accent", accentKey);
}

export function ThemeProvider({ children }) {
  const { token } = useAuth();
  const [accent, setAccentState] = useState(
    () => localStorage.getItem(ACCENT_KEY) || "blue"
  );
  const [mode, setModeState] = useState(
    () => localStorage.getItem(MODE_KEY) || "light"
  );

  // Guards against pushing the value we just pulled from the server
  // straight back to the server on the initial sync.
  const syncingFromServer = useRef(false);

  useEffect(() => {
    applyTheme(accent, mode);
  }, [accent, mode]);

  // Pull the admin's saved appearance from the backend whenever we have
  // a token (on app load with a saved session, and right after login) so
  // it follows them across devices.
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getPreferences()
      .then((res) => {
        const data = res?.preferences || res;
        if (cancelled || !data) return;
        syncingFromServer.current = true;
        if (data.theme_accent && ACCENTS[data.theme_accent]) {
          localStorage.setItem(ACCENT_KEY, data.theme_accent);
          setAccentState(data.theme_accent);
        }
        if (data.theme_mode) {
          localStorage.setItem(MODE_KEY, data.theme_mode);
          setModeState(data.theme_mode);
        }
      })
      .catch(() => {
        // Server unreachable — keep whatever theme is already applied.
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  function pushToServer(patch) {
    if (syncingFromServer.current) {
      syncingFromServer.current = false;
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    updatePreferences(patch).catch(() => {
      // Best-effort: appearance still applies locally even if the
      // server save fails (e.g. offline).
    });
  }

  function setAccent(key) {
    if (!ACCENTS[key]) return;
    localStorage.setItem(ACCENT_KEY, key);
    setAccentState(key);
    pushToServer({ theme_accent: key });
  }

  function setMode(nextMode) {
    const value = nextMode === "dark" ? "dark" : "light";
    localStorage.setItem(MODE_KEY, value);
    setModeState(value);
    pushToServer({ theme_mode: value });
  }

  const value = { accent, mode, setAccent, setMode, ACCENTS };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
