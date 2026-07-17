import { useNavigate } from "react-router-dom";
import RoomActions from "./RoomActions";

// ==========================================================
// RoomRow
// One <tr> in the rooms table. Clicking the row (outside the
// action buttons) opens the room's details page.
// ==========================================================

const STATUS_BADGE = {
  Available: "badge-available",
  Occupied: "badge-occupied",
  Maintenance: "badge-maintenance",
};

function RoomRow({ room, hostelName, onDelete }) {
  const navigate = useNavigate();

  const occupiedBeds = Math.max(0, (room.total_beds || 0) - (room.available_beds || 0));
  const occupancyPct = room.total_beds ? Math.round((occupiedBeds / room.total_beds) * 100) : 0;

  return (
    <tr className="room-row" onClick={() => navigate(`/rooms/${room.id}`)}>
      <td>
        <div className="room-cell-main">
          <div className="room-avatar">{room.room_number}</div>
          <div>
            <div className="room-cell-title">Room {room.room_number}</div>
            <div className="room-cell-sub">Floor {room.floor}</div>
          </div>
        </div>
      </td>

      <td>
        <div className="room-cell-title">{hostelName || "Unknown Hostel"}</div>
      </td>

      <td>
        <div className="room-cell-title">{room.room_type}</div>
        <div className="room-cell-sub">{room.sharing_type}</div>
      </td>

      <td>
        <div className="room-cell-title">
          {occupiedBeds} / {room.total_beds} occupied
        </div>
        <div className="room-cell-sub">{room.available_beds} available</div>
        <div className="room-beds-bar-wrap">
          <div className="room-beds-bar-fill" style={{ width: `${occupancyPct}%` }} />
        </div>
      </td>

      <td>
        <div className="room-cell-title">₹{Number(room.monthly_fee).toLocaleString("en-IN")}</div>
        <div className="room-cell-sub">per month</div>
      </td>

      <td>
        <span className={`room-badge ${STATUS_BADGE[room.status] || ""}`}>
          {room.status}
        </span>
      </td>

      <td>
        <RoomActions room={room} onDelete={onDelete} />
      </td>
    </tr>
  );
}

export default RoomRow;
