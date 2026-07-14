import { Link } from "react-router-dom";

// ==========================================================
// UpcomingFees
// Shows the nearest pending fee dues, sourced from
// GET /api/fees/pending
// ==========================================================

function formatCurrency(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function formatDueDate(dateStr) {
  if (!dateStr) return "—";
  const due = new Date(dateStr);
  const diffDays = Math.ceil((due - new Date()) / 86400000);
  const label = due.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (diffDays < 0) return { label, tag: `${Math.abs(diffDays)}d overdue`, danger: true };
  if (diffDays === 0) return { label, tag: "Due today", danger: true };
  return { label, tag: `in ${diffDays}d`, danger: false };
}

function UpcomingFees({ fees = [], loading }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Upcoming Fees</h3>
          <div className="panel-sub">Nearest pending dues</div>
        </div>
        <Link className="panel-link" to="/fees">View all</Link>
      </div>

      {loading ? (
        <div className="list-col">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
          ))}
        </div>
      ) : fees.length === 0 ? (
        <div className="empty-state">No pending fees. Everything's collected 🎉</div>
      ) : (
        <div className="list-col">
          {fees.map((f) => {
            const due = formatDueDate(f.due_date);
            return (
              <div className="list-item" key={f.id}>
                <div
                  className="list-item-icon"
                  style={{ background: "rgba(245, 158, 11, 0.12)", color: "#B45309" }}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="list-item-body">
                  <div className="list-item-title">{f.student_name || "Student"}</div>
                  <div className="list-item-meta">
                    Room {f.room_number || "—"} · Due {due.label}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className="list-item-title" style={{ color: "#1E293B" }}>
                    {formatCurrency(f.remaining_amount)}
                  </div>
                  <span
                    className="list-item-meta"
                    style={{ color: due.danger ? "#DC2626" : "#64748B", fontWeight: 600 }}
                  >
                    {due.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UpcomingFees;
