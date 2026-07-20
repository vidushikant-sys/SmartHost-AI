function ComplaintStats({ stats, loading }) {
  const CARDS = [
    {
      label: "Total",
      value: stats?.total_complaints ?? 0,
      color: "blue",
      icon: (
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Open",
      value: stats?.open_complaints ?? 0,
      color: "red",
      icon: (
        <path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "In Progress",
      value: stats?.in_progress_complaints ?? 0,
      color: "amber",
      icon: (
        <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Resolved",
      value: stats?.resolved_complaints ?? 0,
      color: "green",
      icon: (
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "High + Emergency",
      value: (stats?.high_priority_complaints ?? 0) + (stats?.emergency_complaints ?? 0),
      color: "purple",
      icon: (
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
  ];

  return (
    <div className="room-stats-grid">
      {CARDS.map((c) => (
        <div className={`room-stat-card stat-${c.color}`} key={c.label}>
          <div className="room-stat-icon">
            <svg viewBox="0 0 24 24">{c.icon}</svg>
          </div>
          <div>
            <div className="room-stat-value">{loading ? "—" : c.value}</div>
            <div className="room-stat-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComplaintStats;
