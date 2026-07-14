import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/topNavbar.css";

function TopNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin")) || {};
    } catch {
      return {};
    }
  })();

  const displayName = admin.full_name || "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/");
  }

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <div className="brand-mark">SH</div>
        <div className="brand-text">
          <h2>SmartHost AI</h2>
          <span>Hostel Management Platform</span>
        </div>
      </div>

      <div className="top-navbar-search">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Search students, rooms, complaints..." />
      </div>

      <div className="top-navbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
            />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <span className="notif-dot" />
        </button>

        <div className="navbar-divider" />

        <div className="admin-menu" ref={menuRef}>
          <button className="admin-trigger" onClick={() => setMenuOpen((o) => !o)}>
            <div className="avatar">{initial}</div>
            <div className="admin-info">
              <strong>{displayName}</strong>
              <span>Administrator</span>
            </div>
            <svg
              className={`chevron ${menuOpen ? "open" : ""}`}
              viewBox="0 0 24 24" fill="none"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <div className="admin-dropdown">
              <button onClick={() => navigate("/settings")}>
                Profile Settings
              </button>
              <button onClick={() => navigate("/settings")}>
                Preferences
              </button>
              <div className="dropdown-divider" />
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
