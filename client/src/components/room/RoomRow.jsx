import { useNavigate } from "react-router-dom";
import RoomActions from "./RoomActions";

// ==========================================================
// RoomRow
// One <tr> in the rooms table. Clicking the row (outside the
// action buttons) opens the room's details page.
// ==========================================================

const STATUS_BADGE = {
  Available: "badge-active",
  Occupied: "badge-left",
  Maintenance: "badge-inactive",
};

function RoomRow({ room, onDelete }) {
  const navigate = useNavigate();

  const occupied = Math.max(0, (room.total_beds || 0) - (room.available_beds || 0));

  return (
    <tr className="room-row" onClick={() => navigate(`/rooms/${room.id}`)}>
      <td>
        <div className="room-cell-title">{room.room_number}</div>
        <div className="room-cell-sub">Floor {room.floor}</div>
      </td>

      <td>
        <div className="room-cell-title">{room.hostel_name || `Hostel #${room.hostel_id}`}</div>
      </td>

      <td>
        <div className="room-cell-title">{room.room_type}</div>
        <div className="room-cell-sub">{room.sharing_type}</div>
      </td>

      <td>
        <div className="room-cell-title">
          {occupied}/{room.total_beds} occupied
        </div>
        <div className="room-cell-sub">{room.available_beds} beds free</div>
      </td>

      <td>
        <div className="room-cell-title">
          ₹{Number(room.monthly_fee || 0).toLocaleString("en-IN")}
        </div>
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
