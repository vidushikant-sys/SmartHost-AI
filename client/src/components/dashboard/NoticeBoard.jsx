import { Link } from "react-router-dom";

// ==========================================================
// NoticeBoard
// Shows the latest active notices, sourced from
// GET /api/notice/all
// ==========================================================

const PRIORITY_BADGE_CLASS = {
  Normal: "normal",
  Important: "important",
  Urgent: "urgent",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function NoticeBoard({ notices = [], loading }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Notice Board</h3>
          <div className="panel-sub">Active announcements</div>
        </div>
        <Link className="panel-link" to="/notices">View all</Link>
      </div>

      {loading ? (
        <div className="list-col">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="empty-state">No active notices right now.</div>
      ) : (
        <div className="list-col">
          {notices.map((n) => (
            <div className="list-item" key={n.id}>
              <div
                className="list-item-icon"
                style={{ background: "rgba(139, 92, 246, 0.1)", color: "#7C3AED" }}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4M9 17v3l4-3h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="list-item-body">
                <div className="list-item-title">{n.title}</div>
                <div className="list-item-meta">
                  {n.category} · {formatDate(n.created_at)}
                </div>
              </div>

              <span className={`badge ${PRIORITY_BADGE_CLASS[n.priority] || "normal"}`}>
                {n.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;
