import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllNotifications,
  getNotificationStats,
  markNotificationAsRead,
  deleteNotification,
} from "../../services/notificationService";
import "../../styles/settings.css";
import "../../styles/notification.css";

const PAGE_SIZE = 10;

const TYPE_OPTIONS = ["All", "Fee", "Complaint", "Notice", "Allocation", "General"];
const STATUS_OPTIONS = ["All", "Unread", "Read"];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const [busyId, setBusyId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    return Promise.all([
      getAllNotifications(),
      getNotificationStats().catch(() => null),
    ])
      .then(([list, statsData]) => {
        setNotifications(Array.isArray(list) ? list : []);
        setStats(statsData);
        setErrorMsg("");
      })
      .catch((err) => setErrorMsg(err.message || "Failed to load notifications"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications.filter((n) => {
      const matchesSearch =
        !q ||
        n.title?.toLowerCase().includes(q) ||
        n.message?.toLowerCase().includes(q) ||
        n.student_name?.toLowerCase().includes(q);
      const matchesType = type === "All" || n.type === type;
      const matchesStatus =
        status === "All" ||
        (status === "Unread" && !n.is_read) ||
        (status === "Read" && n.is_read);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, search, type, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    setPage(1);
  }, [search, type, status]);

  async function handleMarkRead(id) {
    setBusyId(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update notification");
      loadData();
    } finally {
      setBusyId(null);
    }
  }

  async function handleMarkAllRead() {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)));
    } catch (err) {
      setErrorMsg(err.message || "Failed to mark all as read");
      loadData();
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNotification(deleteTarget.id);
      setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete notification");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="settings-page notif-center">
        <div className="settings-header">
          <div>
            <h1>Notifications</h1>
            <p>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              className="notif-mark-all-page"
              onClick={handleMarkAllRead}
              disabled={markingAll}
            >
              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {stats && (
          <div className="notif-stats-grid">
            <StatCard label="Total" value={stats.total_notifications} />
            <StatCard label="Unread" value={stats.unread_notifications} accent="warning" />
            <StatCard label="Read" value={stats.read_notifications} accent="success" />
            <StatCard label="Fee" value={stats.fee_notifications} />
            <StatCard label="Complaint" value={stats.complaint_notifications} />
            <StatCard label="Notice" value={stats.notice_notifications} />
          </div>
        )}

        <section className="settings-card">
          <div className="notif-filters">
            <div className="notif-search">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search title, message, student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All types" : t}
                </option>
              ))}
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && <p className="settings-error">{errorMsg}</p>}

          {loading && <p className="settings-hint">Loading notifications...</p>}

          {!loading && paginated.length === 0 && (
            <p className="settings-hint">No notifications match your filters.</p>
          )}

          {!loading && paginated.length > 0 && (
            <ul className="notif-full-list">
              {paginated.map((n) => (
                <li key={n.id} className={`notif-full-item ${!n.is_read ? "unread" : ""}`}>
                  <span className={`notif-type-dot type-${n.type?.toLowerCase()}`} />
                  <div className="notif-full-body">
                    <div className="notif-full-top">
                      <span className="notif-full-title">{n.title}</span>
                      <span className={`notif-type-pill type-${n.type?.toLowerCase()}`}>
                        {n.type}
                      </span>
                    </div>
                    <p className="notif-full-message">{n.message}</p>
                    <p className="notif-full-meta">
                      {n.student_name ? `${n.student_name} • ` : ""}
                      {formatDate(n.created_at)}
                    </p>
                  </div>
                  <div className="notif-full-actions">
                    {!n.is_read && (
                      <button
                        className="notif-action-btn"
                        onClick={() => handleMarkRead(n.id)}
                        disabled={busyId === n.id}
                      >
                        {busyId === n.id ? "..." : "Mark read"}
                      </button>
                    )}
                    <button
                      className="notif-action-btn danger"
                      onClick={() => setDeleteTarget(n)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && totalPages > 1 && (
            <div className="notif-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {deleteTarget && (
        <div className="notif-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete notification?</h3>
            <p>
              This will permanently delete "{deleteTarget.title}". This action cannot be undone.
            </p>
            <div className="notif-modal-actions">
              <button
                className="notif-modal-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="notif-modal-confirm"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`notif-stat-card ${accent ? `accent-${accent}` : ""}`}>
      <span className="notif-stat-value">{value ?? 0}</span>
      <span className="notif-stat-label">{label}</span>
    </div>
  );
}

export default NotificationCenter;
