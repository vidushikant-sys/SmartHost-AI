import { useNavigate } from "react-router-dom";

// ==========================================================
// QuickActions
// Shortcut grid for the most common admin tasks.
// ==========================================================

const ACTIONS = [
  {
    label: "Add Student",
    path: "/students/add",
    color: { bg: "rgba(37, 99, 235, 0.1)", fg: "#2563EB" },
    icon: (
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Allocate Room",
    path: "/rooms/allocate",
    color: { bg: "rgba(34, 197, 94, 0.1)", fg: "#16803C" },
    icon: (
      <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Collect Fee",
    path: "/fees/generate",
    color: { bg: "rgba(245, 158, 11, 0.12)", fg: "#B45309" },
    icon: (
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Post Notice",
    path: "/notices/new",
    color: { bg: "rgba(139, 92, 246, 0.1)", fg: "#7C3AED" },
    icon: (
      <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4M9 17v3l4-3h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Quick Actions</h3>
      </div>

      <div className="quick-actions-grid">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            className="quick-action-btn"
            onClick={() => navigate(a.path)}
          >
            <div className="qa-icon" style={{ background: a.color.bg, color: a.color.fg }}>
              <svg viewBox="0 0 24 24">{a.icon}</svg>
            </div>
            <span className="qa-label">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
