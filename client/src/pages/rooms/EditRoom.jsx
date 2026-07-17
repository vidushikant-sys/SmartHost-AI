import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RoomForm from "../../components/room/RoomForm";
import { getRoomById, updateRoom } from "../../services/roomService";
import "../../styles/room.css";

function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    getRoomById(id)
      .then((data) => mounted && setRoom(data))
      .catch((err) => mounted && setLoadError(err.message || "Failed to load room"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleSubmit(values) {
    await updateRoom(id, values); // throws with .errors on validation failure
    navigate(`/rooms/${id}`, { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-form-header">
          <button className="room-back-link" onClick={() => navigate(`/rooms/${id}`)}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Room
          </button>
          <h1>Edit Room</h1>
          <p className="room-page-subtitle">
            Update Room {room?.room_number || ""}'s details.
          </p>
        </div>

        {loading ? (
          <div className="room-form-loading">Loading room details...</div>
        ) : loadError ? (
          <div className="room-page-error">{loadError}</div>
        ) : (
          <RoomForm initialValues={room} onSubmit={handleSubmit} submitLabel="Update Room" />
        )}
      </div>
    </DashboardLayout>
  );
}

export default EditRoom;
