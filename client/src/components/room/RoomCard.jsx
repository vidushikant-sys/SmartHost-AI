import { useNavigate } from "react-router-dom";
import RoomActions from "./RoomActions";

// ==========================================================
// RoomCard
// Mobile-friendly card view of a room (shown instead of the
// table on small screens — see room.css media queries).
// ==========================================================

const STATUS_BADGE = {
  Available: "badge-available",
  Occupied: "badge-occupied",
  Maintenance: "badge-maintenance",
};

function RoomCard({ room, hostelName, onDelete }) {
  const navigate = useNavigate();

  const occupiedBeds = Math.max(0, (room.total_beds || 0) - (room.available_beds || 0));

  return (
    <div className="room-card" onClick={() => navigate(`/rooms/${room.id}`)}>
      <div className="room-card-top">
        <div className="room-cell-main">
          <div className="room-avatar">{room.room_number}</div>
          <div>
            <div className="room-cell-title">Room {room.room_number}</div>
            <div className="room-cell-sub">{hostelName || "Unknown Hostel"}</div>
          </div>
        </div>
        <span className={`room-badge ${STATUS_BADGE[room.status] || ""}`}>{room.status}</span>
      </div>

      <div className="room-card-body">
        <div>
          <strong>{room.room_type}</strong>
          Room Type
        </div>
        <div>
          <strong>{room.sharing_type}</strong>
          Sharing
        </div>
        <div>
          <strong>{occupiedBeds} / {room.total_beds}</strong>
          Beds Occupied
        </div>
        <div>
          <strong>₹{Number(room.monthly_fee).toLocaleString("en-IN")}</strong>
          Monthly Fee
        </div>
      </div>

      <div className="room-card-footer">
        <span className="room-cell-sub">Floor {room.floor}</span>
        <RoomActions room={room} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default RoomCard;
