import { useNavigate } from "react-router-dom";
import RoomActions from "./RoomActions";

// ==========================================================
// RoomCard
// Mobile card view of a single room — same data as RoomRow
// but laid out for narrow screens. Not wired into RoomTable
// by default (RoomTable already collapses into a card-like
// layout via CSS on small screens), but available for pages
// that want an explicit card grid (e.g. a dashboard widget).
// ==========================================================

const STATUS_BADGE = {
  Available: "badge-active",
  Occupied: "badge-left",
  Maintenance: "badge-inactive",
};

function RoomCard({ room, onDelete }) {
  const navigate = useNavigate();
  const occupied = Math.max(0, (room.total_beds || 0) - (room.available_beds || 0));

  return (
    <div className="room-card" onClick={() => navigate(`/rooms/${room.id}`)}>
      <div className="room-card-header">
        <div>
          <div className="room-cell-title">{room.room_number}</div>
          <div className="room-cell-sub">
            {room.hostel_name || `Hostel #${room.hostel_id}`} · Floor {room.floor}
          </div>
        </div>
        <span className={`room-badge ${STATUS_BADGE[room.status] || ""}`}>
          {room.status}
        </span>
      </div>

      <div className="room-card-body">
        <div className="room-card-stat">
          <span className="room-card-stat-label">Type</span>
          <span className="room-card-stat-value">{room.room_type}</span>
        </div>
        <div className="room-card-stat">
          <span className="room-card-stat-label">Sharing</span>
          <span className="room-card-stat-value">{room.sharing_type}</span>
        </div>
        <div className="room-card-stat">
          <span className="room-card-stat-label">Beds</span>
          <span className="room-card-stat-value">
            {occupied}/{room.total_beds}
          </span>
        </div>
        <div className="room-card-stat">
          <span className="room-card-stat-label">Fee</span>
          <span className="room-card-stat-value">
            ₹{Number(room.monthly_fee || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="room-card-footer">
        <RoomActions room={room} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default RoomCard;
