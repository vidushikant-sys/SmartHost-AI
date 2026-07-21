const CATEGORIES = ["General", "Fee", "Maintenance", "Event", "Hostel", "Emergency"];

function NoticeFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
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
          placeholder="Search notices..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="room-status-filter"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="room-status-filter"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="All">All Priority</option>
        <option value="Urgent">Urgent</option>
        <option value="Important">Important</option>
        <option value="Normal">Normal</option>
      </select>

      <select
        className="room-status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Draft">Draft</option>
        <option value="Expired">Expired</option>
      </select>
    </div>
  );
}

export default NoticeFilters;
