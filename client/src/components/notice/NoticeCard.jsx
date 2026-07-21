import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PRIORITY_STYLE = {
  Urgent: { bg: "rgba(220, 38, 38, 0.1)", color: "#DC2626" },
  Important: { bg: "rgba(245, 158, 11, 0.12)", color: "#B45309" },
  Normal: { bg: "rgba(100, 116, 139, 0.1)", color: "#475569" },
};

const STATUS_BADGE = {
  Active: "badge-active",
  Expired: "badge-inactive",
  Draft: "badge-left",
};

const CATEGORY_ICON = {
  General: "📌",
  Fee: "💰",
  Maintenance: "🔧",
  Event: "🎉",
  Hostel: "🏠",
  Emergency: "🚨",
};

function NoticeCard({ notice, onDelete }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const priorityStyle = PRIORITY_STYLE[notice.priority] || PRIORITY_STYLE.Normal;
  const isLong = notice.description?.length > 180;
  const shownDescription =
    expanded || !isLong ? notice.description : `${notice.description.slice(0, 180)}...`;

  return (
    <div className="notice-card">
      <div className="notice-card-header">
        <div className="notice-card-title-row">
          <span className="notice-category-icon">{CATEGORY_ICON[notice.category] || "📌"}</span>
          <h3 className="notice-card-title">{notice.title}</h3>
        </div>
        <span
          className="notice-priority-badge"
          style={{ background: priorityStyle.bg, color: priorityStyle.color }}
        >
          {notice.priority}
        </span>
      </div>

      <p className="notice-card-description">
        {shownDescription}
        {isLong && (
          <button
            type="button"
            className="notice-read-more"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? " Show less" : " Read more"}
          </button>
        )}
      </p>

      <div className="notice-card-meta">
        <span className={`room-badge ${STATUS_BADGE[notice.status] || ""}`}>
          {notice.status}
        </span>
        <span className="notice-card-tag">{notice.category}</span>
        <span className="notice-card-tag">
          {notice.hostel_name ? notice.hostel_name : "All Hostels"}
        </span>
        {notice.expiry_date && (
          <span className="notice-card-tag">
            Expires {new Date(notice.expiry_date).toLocaleDateString("en-IN")}
          </span>
        )}
      </div>

      <div className="notice-card-footer">
        <span className="notice-card-posted">
          {notice.admin_name && `By ${notice.admin_name} · `}
          {new Date(notice.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <div className="room-row-actions">
          <button
            className="room-icon-btn"
            title="Edit Notice"
            onClick={() => navigate(`/notices/${notice.id}/edit`)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="room-icon-btn danger"
            title="Delete Notice"
            onClick={() => onDelete(notice)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoticeCard;
