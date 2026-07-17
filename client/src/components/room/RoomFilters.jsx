// ==========================================================
// RoomFilters
// Search + Room Type + Sharing Type + Status filter bar for
// RoomList. Fully controlled — parent owns the state.
// ==========================================================

function RoomFilters({
  search,
  onSearchChange,
  roomType,
  onRoomTypeChange,
  sharingType,
  onSharingTypeChange,
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
          placeholder="Search by room number or hostel..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="room-filter-select"
        value={roomType}
        onChange={(e) => onRoomTypeChange(e.target.value)}
      >
        <option value="All">All Room Types</option>
        <option value="Standard">Standard</option>
        <option value="Deluxe">Deluxe</option>
        <option value="Premium">Premium</option>
        <option value="AC">AC</option>
        <option value="Non AC">Non AC</option>
      </select>

      <select
        className="room-filter-select"
        value={sharingType}
        onChange={(e) => onSharingTypeChange(e.target.value)}
      >
        <option value="All">All Sharing Types</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Triple">Triple</option>
        <option value="Four Sharing">Four Sharing</option>
      </select>

      <select
        className="room-filter-select"
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
