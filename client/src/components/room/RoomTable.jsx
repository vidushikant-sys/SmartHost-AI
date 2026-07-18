import RoomRow from "./RoomRow";

// ==========================================================
// RoomTable
// Renders the table header + one RoomRow per room. Handles
// its own loading skeleton / empty state.
// ==========================================================

function RoomTable({ rooms, loading, onDelete }) {
  if (loading) {
    return (
      <div className="room-table-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="room-skeleton-row" />
        ))}
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="room-table-wrap">
        <div className="room-empty-state">
          <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
            <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>No rooms found. Try adjusting your search or add a new room.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-table-wrap">
      <table className="room-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Hostel</th>
            <th>Type / Sharing</th>
            <th>Beds</th>
            <th>Fee</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <RoomRow key={room.id} room={room} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomTable;
