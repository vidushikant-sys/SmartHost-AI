import { useNavigate } from "react-router-dom";

// ==========================================================
// RoomActions
// View / Edit / Delete icon buttons for a single room
// (used inside both RoomRow and RoomCard).
// ==========================================================

function RoomActions({ room, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="room-row-actions" onClick={(e) => e.stopPropagation()}>
      <button
        className="room-icon-btn"
        title="View Room"
        onClick={() => navigate(`/rooms/${room.id}`)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>

      <button
        className="room-icon-btn"
        title="Edit Room"
        onClick={() => navigate(`/rooms/${room.id}/edit`)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        className="room-icon-btn danger"
        title="Delete Room"
        onClick={() => onDelete(room)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default RoomActions;
