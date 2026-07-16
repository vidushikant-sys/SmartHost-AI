// ==========================================================
// StudentStats
// Small KPI row above the student table — computed client
// side from the loaded students array (no extra API call).
// ==========================================================

function StudentStats({ students = [], loading }) {
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const inactive = students.filter((s) => s.status === "Inactive").length;
  const left = students.filter((s) => s.status === "Left").length;

  const CARDS = [
    {
      label: "Total Students",
      value: total,
      color: "blue",
      icon: (
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Active",
      value: active,
      color: "green",
      icon: (
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Inactive",
      value: inactive,
      color: "amber",
      icon: (
        <path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
    {
      label: "Left Hostel",
      value: left,
      color: "purple",
      icon: (
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ),
    },
  ];

  return (
    <div className="student-stats-grid">
      {CARDS.map((c) => (
        <div className={`student-stat-card stat-${c.color}`} key={c.label}>
          <div className="student-stat-icon">
            <svg viewBox="0 0 24 24">{c.icon}</svg>
          </div>
          <div>
            <div className="student-stat-value">{loading ? "—" : c.value}</div>
            <div className="student-stat-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentStats;
