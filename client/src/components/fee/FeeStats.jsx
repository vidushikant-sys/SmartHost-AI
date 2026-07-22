function formatCurrency(n) {
  const num = Number(n || 0);
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function FeeStats({ stats, loading }) {
  const CARDS = [
    {
      label: "Total Fees",
      value: stats?.total_fees ?? 0,
      color: "blue",
      icon: (
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
      isCurrency: false,
    },
    {
      label: "Paid",
      value: stats?.paid_fees ?? 0,
      color: "green",
      icon: (
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
      isCurrency: false,
    },
    {
      label: "Pending",
      value: stats?.pending_fees ?? 0,
      color: "amber",
      icon: (
        <path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
      isCurrency: false,
    },
    {
      label: "Partial",
      value: stats?.partial_fees ?? 0,
      color: "purple",
      icon: (
        <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M6 3h12" />
          <path d="M6 8h12" />
          <path d="M6 13h3" />
          <path d="M9 13c6.667 0 6.667-10 0-10" />
          <path d="m6 13 8.5 8" />
        </g>
      ),
      isCurrency: false,
    },
    {
      label: "Collected",
      value: formatCurrency(stats?.total_collection),
      color: "green",
      icon: (
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 0 0 0 4h4v-4h-4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Total Due",
      value: formatCurrency(stats?.total_due),
      color: "red",
      icon: (
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
  ];

  return (
    <div className="room-stats-grid fee-stats-grid">
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

export default FeeStats;
