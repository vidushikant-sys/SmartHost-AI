// ==========================================================
// RoomStats
// Small KPI row above the room table — computed client side
// from the loaded rooms array (no extra API call).
// ==========================================================

function RoomStats({ rooms = [], loading }) {
  const total = rooms.length;
  const available = rooms.filter((r) => r.status === "Available").length;
  const occupied = rooms.filter((r) => r.status === "Occupied").length;
  const maintenance = rooms.filter((r) => r.status === "Maintenance").length;
  const totalBeds = rooms.reduce((sum, r) => sum + (r.total_beds || 0), 0);
  const freeBeds = rooms.reduce((sum, r) => sum + (r.available_beds || 0), 0);

  const CARDS = [
    {
      label: "Total Rooms",
      value: total,
      color: "blue",
      icon: (
        <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Available",
      value: available,
      color: "green",
      icon: (
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Occupied",
      value: occupied,
      color: "purple",
      icon: (
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Maintenance",
      value: maintenance,
      color: "amber",
      icon: (
        <path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Beds Free",
      value: `${freeBeds}/${totalBeds}`,
      color: "red",
      icon: (
        <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 14h20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

export default RoomStats;
