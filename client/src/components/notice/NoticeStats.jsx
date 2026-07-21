function NoticeStats({ stats, loading }) {
  const CARDS = [
    {
      label: "Total",
      value: stats?.total_notices ?? 0,
      color: "blue",
      icon: (
        <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4M9 17v3l4-3h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Active",
      value: stats?.active_notices ?? 0,
      color: "green",
      icon: (
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Expired",
      value: stats?.expired_notices ?? 0,
      color: "amber",
      icon: (
        <path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Important",
      value: stats?.important_notices ?? 0,
      color: "purple",
      icon: (
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Urgent",
      value: stats?.urgent_notices ?? 0,
      color: "red",
      icon: (
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

export default NoticeStats;
