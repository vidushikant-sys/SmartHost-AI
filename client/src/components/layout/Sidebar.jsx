import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

// ==========================================================
// Sidebar
// Collapsible left navigation for the whole admin app.
// Collapse state persists across reloads via localStorage.
// ==========================================================

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: (
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
        ),
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Hostels",
        path: "/hostels",
        icon: (
          <path
            d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
      {
        label: "Students",
        path: "/students",
        icon: (
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
      {
        label: "Rooms",
        path: "/rooms",
        icon: (
          <path
            d="M3 22V12l9-6 9 6v10M9 22v-6h6v6"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
      {
        label: "Fees",
        path: "/fees",
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
        label: "Complaints",
        path: "/complaints",
        icon: (
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
      {
        label: "Notices",
        path: "/notices",
        icon: (
          <path
            d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4M9 17v3l4-3h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Reports",
        path: "/reports",
        icon: (
          <path
            d="M18 20V10M12 20V4M6 20v-6"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: (
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ),
      },
      {
        label: "Settings",
        path: "/settings",
        icon: (
          <>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" fill="none" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </>
        ),
      },
    ],
  },
];

function Sidebar({ collapsed, onToggle }) {
  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin")) || {};
    } catch {
      return {};
    }
  })();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">SH</div>
        {!collapsed && (
          <div className="brand-text">
            <h2>SmartHost AI</h2>
            <span>Hostel Management</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div className="nav-section" key={section.label}>
            {!collapsed && <div className="nav-section-label">{section.label}</div>}

            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24">{item.icon}</svg>
                </span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-admin">
          <div className="avatar">
            {(admin.full_name || "A").charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="admin-info">
              <strong>{admin.full_name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          )}
        </div>

        <button
          className="collapse-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg viewBox="0 0 24 24" fill="none" className={collapsed ? "flipped" : ""}>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
