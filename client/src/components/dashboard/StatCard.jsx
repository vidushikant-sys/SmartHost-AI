// ==========================================================
// StatCard
// Small KPI card used in the top stats row of the dashboard.
//
// Props:
//  - label: string
//  - value: string | number
//  - icon: JSX (svg element)
//  - color: "blue" | "green" | "amber" | "purple"
//  - trend: { direction: "up" | "down", value: "12%" } (optional)
// ==========================================================

const COLOR_MAP = {
  blue: { bg: "rgba(37, 99, 235, 0.1)", fg: "#2563EB" },
  green: { bg: "rgba(34, 197, 94, 0.1)", fg: "#16803C" },
  amber: { bg: "rgba(245, 158, 11, 0.12)", fg: "#B45309" },
  purple: { bg: "rgba(139, 92, 246, 0.1)", fg: "#7C3AED" },
};

function StatCard({ label, value, icon, color = "blue", trend, loading }) {
  const palette = COLOR_MAP[color] || COLOR_MAP.blue;

  if (loading) {
    return (
      <div className="stat-card">
        <div className="skeleton" style={{ width: 46, height: 46, borderRadius: 13 }} />
        <div className="skeleton" style={{ width: "60%", height: 26 }} />
        <div className="skeleton" style={{ width: "40%", height: 14 }} />
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: palette.bg, color: palette.fg }}>
          {icon}
        </div>

        {trend && (
          <div className={`stat-trend ${trend.direction}`}>
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
              {trend.direction === "up" ? (
                <path d="M4 16L10 10L14 14L20 8M20 8H15M20 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 8L10 14L14 10L20 16M20 16H15M20 16V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
            {trend.value}
          </div>
        )}
      </div>

      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default StatCard;
