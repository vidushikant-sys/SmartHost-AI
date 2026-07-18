import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RoomForm from "../../components/room/RoomForm";
import { createRoom } from "../../services/roomService";
import "../../styles/room.css";

function AddRoom() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    await createRoom(values); // throws with .errors on validation failure
    navigate("/rooms", { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-form-header">
          <button className="room-back-link" onClick={() => navigate("/rooms")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Rooms
          </button>
          <h1>Add New Room</h1>
          <p className="room-page-subtitle">
            Fill in the room's details to create a new record.
          </p>
        </div>

        <RoomForm onSubmit={handleSubmit} submitLabel="Add Room" isEdit={false} />
      </div>
    </DashboardLayout>
  );
}

export default AddRoom;
