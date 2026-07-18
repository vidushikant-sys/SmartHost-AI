// ==========================================================
// RoomFilters
// Search + status filter bar for RoomList.
// Fully controlled — parent owns the state.
// ==========================================================

function RoomFilters({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="room-filters">
      <div className="room-search">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by room number, type or hostel..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="room-status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>
        <option value="Maintenance">Maintenance</option>
      </select>
    </div>
  );
}

export default RoomFilters;
