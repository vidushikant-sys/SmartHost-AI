const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function FeeFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  month,
  onMonthChange,
}) {
  return (
    <div className="room-filters">
      <div className="room-search">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by student or room..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="room-status-filter"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        <option value="All">All Months</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>

      <select
        className="room-status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Paid">Paid</option>
        <option value="Partial">Partial</option>
        <option value="Pending">Pending</option>
      </select>
    </div>
  );
}

export default FeeFilters;
