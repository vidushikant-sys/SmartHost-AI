import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAllHostels } from "../services/hostelService";

// ==========================================================
// HostelContext
// The single source of truth for "which hostel is the admin
// currently viewing". Every list page (Students, Rooms, Fees,
// Complaints, Notices) and the Dashboard read `selectedHostelId`
// from here and pass it to their service calls as ?hostel_id=.
//
// - "All Hostels" is represented as selectedHostelId === null.
// - Selection persists across refreshes via localStorage.
// - Wrap <AppRoutes> with <HostelProvider>, same as <AuthProvider>.
// ==========================================================

const HostelContext = createContext(null);

function readStoredHostelId() {
  try {
    const raw = localStorage.getItem("selectedHostelId");
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function HostelProvider({ children }) {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHostelId, setSelectedHostelId] = useState(readStoredHostelId);

  const loadHostels = useCallback(() => {
    setLoading(true);
    return getAllHostels()
      .then((data) => {
        setHostels(data || []);
        setError("");
      })
      .catch((err) => setError(err.message || "Failed to load hostels"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadHostels();
  }, [loadHostels]);

  // If the previously-selected hostel no longer exists (deleted, or
  // stale localStorage from another account), fall back to "All".
  useEffect(() => {
    if (
      !loading &&
      selectedHostelId !== null &&
      hostels.length > 0 &&
      !hostels.some((h) => h.id === selectedHostelId)
    ) {
      setSelectedHostelId(null);
    }
  }, [loading, hostels, selectedHostelId]);

  function selectHostel(hostelId) {
    setSelectedHostelId(hostelId);
    if (hostelId === null) {
      localStorage.removeItem("selectedHostelId");
    } else {
      localStorage.setItem("selectedHostelId", String(hostelId));
    }
  }

  const selectedHostel =
    hostels.find((h) => h.id === selectedHostelId) || null;

  const value = {
    hostels,
    loading,
    error,
    selectedHostelId,
    selectedHostel,
    selectHostel,
    refreshHostels: loadHostels,
  };

  return (
    <HostelContext.Provider value={value}>{children}</HostelContext.Provider>
  );
}

export function useHostel() {
  const ctx = useContext(HostelContext);
  if (!ctx) {
    throw new Error("useHostel must be used within a <HostelProvider>");
  }
  return ctx;
}
