import { useEffect, useRef, useState } from "react";
import { useHostel } from "../../context/HostelContext";
import "../../styles/hostelSwitcher.css";

// ==========================================================
// HostelSwitcher
// Dropdown shown in the top navbar. Lets the admin pick a
// single hostel (or "All Hostels") — the choice is stored in
// HostelContext, which every page reads from to scope its data.
// ==========================================================

function HostelSwitcher() {
  const { hostels, loading, selectedHostel, selectedHostelId, selectHostel } =
    useHostel();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handlePick(id) {
    selectHostel(id);
    setOpen(false);
  }

  const label = loading
    ? "Loading..."
    : selectedHostel
    ? selectedHostel.title
    : "All Hostels";

  return (
    <div className="hostel-switcher" ref={ref}>
      <button
        className="hostel-switcher-trigger"
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
      >
        <svg viewBox="0 0 24 24" fill="none" className="hostel-switcher-icon">
          <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hostel-switcher-label">{label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`hostel-switcher-chevron ${open ? "open" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="hostel-switcher-dropdown">
          <button
            className={`hostel-switcher-item ${selectedHostelId === null ? "active" : ""}`}
            onClick={() => handlePick(null)}
          >
            <span>All Hostels</span>
            {selectedHostelId === null && <CheckIcon />}
          </button>

          <div className="hostel-switcher-divider" />

          {hostels.map((h) => (
            <button
              key={h.id}
              className={`hostel-switcher-item ${selectedHostelId === h.id ? "active" : ""}`}
              onClick={() => handlePick(h.id)}
            >
              <span>{h.title}</span>
              {selectedHostelId === h.id && <CheckIcon />}
            </button>
          ))}

          {!loading && hostels.length === 0 && (
            <div className="hostel-switcher-empty">No hostels yet</div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default HostelSwitcher;
