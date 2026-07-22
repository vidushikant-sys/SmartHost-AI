import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

// ==========================================================
// NotificationBell
// Lives in TopNavbar. Polls /api/notification/all, shows an
// unread badge, and lets the admin peek at + act on the most
// recent notifications without leaving the page.
// ==========================================================

const POLL_INTERVAL_MS = 30000;

const TYPE_ROUTES = {
  Fee: "/fees",
  Complaint: "/complaints",
  Notice: "/notices",
  Allocation: "/rooms",
  General: "/students",
};

function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString.replace(" ", "T"));
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  function load() {
    return getAllNotifications()
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => setError(err.message || "Failed to load notifications"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unread = notifications.filter((n) => !n.is_read);
  const recent = notifications.slice(0, 6);

  async function handleItemClick(notif) {
    if (!notif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      markNotificationAsRead(notif.id).catch(() => {
        // Revert on failure so the badge count stays accurate.
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: false } : n))
        );
      });
    }
    setOpen(false);
    navigate(TYPE_ROUTES[notif.type] || "/notifications");
  }

  async function handleMarkAllRead(e) {
    e.stopPropagation();
    if (unread.length === 0) return;
    setMarkingAll(true);
    const ids = unread.map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await Promise.all(ids.map((id) => markNotificationAsRead(id)));
    } catch {
      // If some calls fail, reload from server to get the true state.
      load();
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="notif-bell-wrapper" ref={wrapperRef}>
      <button
        className="icon-btn"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {unread.length > 0 && (
          <span className="notif-dot">{unread.length > 9 ? "9+" : unread.length}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-head">
            <h4>Notifications</h4>
            {unread.length > 0 && (
              <button
                className="notif-mark-all"
                onClick={handleMarkAllRead}
                disabled={markingAll}
              >
                {markingAll ? "Marking..." : "Mark all read"}
              </button>
            )}
          </div>

          <div className="notif-dropdown-list">
            {loading && <p className="notif-dropdown-empty">Loading...</p>}

            {!loading && error && <p className="notif-dropdown-empty">{error}</p>}

            {!loading && !error && recent.length === 0 && (
              <p className="notif-dropdown-empty">You're all caught up.</p>
            )}

            {!loading &&
              recent.map((n) => (
                <button
                  key={n.id}
                  className={`notif-dropdown-item ${!n.is_read ? "unread" : ""}`}
                  onClick={() => handleItemClick(n)}
                >
                  <span className={`notif-type-dot type-${n.type?.toLowerCase()}`} />
                  <span className="notif-item-body">
                    <span className="notif-item-title">{n.title}</span>
                    <span className="notif-item-message">{n.message}</span>
                    <span className="notif-item-meta">
                      {n.student_name ? `${n.student_name} • ` : ""}
                      {timeAgo(n.created_at)}
                    </span>
                  </span>
                </button>
              ))}
          </div>

          <button
            className="notif-view-all"
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
