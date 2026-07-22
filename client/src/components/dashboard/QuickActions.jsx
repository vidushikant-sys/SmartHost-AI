import { useNavigate } from "react-router-dom";

// ==========================================================
// QuickActions
// Shortcut grid for the most common admin tasks.
// ==========================================================

const ACTIONS = [
  {
    label: "Add Student",
    path: "/students/add",
    color: "#7C3AED",
    icon: (
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Allocate Room",
    path: "/rooms/allocate",
    color: "#2563EB",
    icon: (
      <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Generate Fee",
    path: "/fees/generate",
    color: "#16A34A",
    icon: (
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="M6 13h3" />
        <path d="M9 13c6.667 0 6.667-10 0-10" />
        <path d="m6 13 8.5 8" />
      </g>
    ),
  },
  {
    label: "Add Notice",
    path: "/notices/new",
    color: "#F59E0B",
    icon: (
      <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4M9 17v3l4-3h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Register Complaint",
    path: "/complaints/add",
    color: "#EF4444",
    icon: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "View Reports",
    path: "/reports",
    color: "#0EA5E9",
    icon: (
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </g>
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
            <div className="qa-icon" style={{ background: a.color, color: "#fff" }}>
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