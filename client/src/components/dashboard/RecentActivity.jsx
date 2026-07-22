import { Link } from "react-router-dom";

// ==========================================================
// RecentActivity
// Shows the most recent student complaints, sourced from
// GET /api/complaint/all
// ==========================================================

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const STATUS_BADGE_CLASS = {
  Open: "pending",
  "In Progress": "progress",
  Resolved: "resolved",
};

const CATEGORY_ICON = {
  Electricity: (
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
  ),
  Water: (
    <path d="M12 2s7 8 7 13a7 7 0 1 1-14 0c0-5 7-13 7-13z" fill="currentColor" />
  ),
  default: (
    <path
      d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
      stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
  ),
};

const CATEGORY_COLOR = {
  Electricity: "#F59E0B",
  Water: "#0EA5E9",
  default: "#EC4899",
};

function RecentActivity({ complaints = [], loading }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Recent Activity</h3>
          <div className="panel-sub">Latest complaints from students</div>
        </div>
        <Link className="panel-link" to="/complaints">View all</Link>
      </div>

      {loading ? (
        <div className="list-col">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">No recent complaints. All quiet 🎉</div>
      ) : (
        <div className="list-col">
          {complaints.map((c) => (
            <div className="list-item" key={c.id}>
              <div
                className="list-item-icon"
                style={{
                  background: CATEGORY_COLOR[c.category] || CATEGORY_COLOR.default,
                  color: "#fff",
                }}
              >
                <svg viewBox="0 0 24 24">
                  {CATEGORY_ICON[c.category] || CATEGORY_ICON.default}
                </svg>
              </div>

              <div className="list-item-body">
                <div className="list-item-title">{c.title}</div>
                <div className="list-item-meta">
                  {c.student_name || "Student"} · {c.category} · {timeAgo(c.created_at)}
                </div>
              </div>

              <span className={`badge ${STATUS_BADGE_CLASS[c.status] || "pending"}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;