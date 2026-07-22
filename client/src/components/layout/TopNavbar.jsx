import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HostelSwitcher from "./HostelSwitcher";
import NotificationBell from "../notification/NotificationBell";
import GlobalSearch from "../search/GlobalSearch";
import { useAuth } from "../../context/AuthContext";
import { resolveFileUrl } from "../../services/apiClient";
import "../../styles/topNavbar.css";

function TopNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { admin: authAdmin, logout } = useAuth();

  const admin = authAdmin || {};

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
    logout();
    navigate("/");
  }

  return (
    <header className="top-navbar">
      <GlobalSearch />

      <div className="top-navbar-right">
        <HostelSwitcher />

        <NotificationBell />

        <div className="navbar-divider" />

        <div className="admin-menu" ref={menuRef}>
          <button className="admin-trigger" onClick={() => setMenuOpen((o) => !o)}>
            <div className="avatar">
              {admin.avatar_url ? (
                <img src={resolveFileUrl(admin.avatar_url)} alt={displayName} />
              ) : (
                initial
              )}
            </div>
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