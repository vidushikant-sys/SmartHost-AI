import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeleteRoomModal from "../../components/room/DeleteRoomModal";
import { getRoomById, deleteRoom } from "../../services/roomService";
import { getAllHostels } from "../../services/hostelService";
import { getRoomAllocations } from "../../services/allocationService";
import "../../styles/room.css";
import "../../styles/allocation.css";

const STATUS_BADGE = {
  Available: "badge-active",
  Occupied: "badge-left",
  Maintenance: "badge-inactive",
};

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [hostelName, setHostelName] = useState("");
  const [occupants, setOccupants] = useState([]);
  const [occupantsLoading, setOccupantsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    getRoomById(id)
      .then((data) => {
        if (!mounted) return;
        setRoom(data);
        return getAllHostels()
          .then((hostels) => {
            const match = (hostels || []).find((h) => h.id === data.hostel_id);
            if (mounted && match) setHostelName(match.title);
          })
          .catch(() => {});
      })
      .catch((err) => mounted && setLoadError(err.message || "Failed to load room"))
      .finally(() => mounted && setLoading(false));

    getRoomAllocations(id)
      .then((data) => mounted && setOccupants(data || []))
      .catch(() => {})
      .finally(() => mounted && setOccupantsLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoom(deleteTarget.id);
      navigate("/rooms", { replace: true });
    } catch (err) {
      setLoadError(err.message || "Failed to delete room");
      setDeleteTarget(null);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <div className="room-form-loading">Loading room details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadError || !room) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <div className="room-page-error">{loadError || "Room not found"}</div>
        </div>
      </DashboardLayout>
    );
  }

  const occupied = Math.max(0, (room.total_beds || 0) - (room.available_beds || 0));

  return (
    <DashboardLayout>
      <div className="room-page">
        <button className="room-back-link" onClick={() => navigate("/rooms")}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Rooms
        </button>

        <div className="room-profile-header">
          <div className="room-profile-icon">
            <svg viewBox="0 0 24 24" fill="none" width="30" height="30">
              <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="room-profile-heading">
            <h1>Room {room.room_number}</h1>
            <div className="room-profile-meta">
              <span>{hostelName || `Hostel #${room.hostel_id}`}</span>
              <span>·</span>
              <span>Floor {room.floor}</span>
              <span className={`room-badge ${STATUS_BADGE[room.status] || ""}`}>
                {room.status}
              </span>
            </div>
          </div>

          <div className="room-profile-actions">
            <button
              className="room-btn-secondary"
              onClick={() => navigate(`/rooms/${id}/edit`)}
            >
              Edit Room
            </button>
            <button
              className="room-btn-danger"
              onClick={() => setDeleteTarget(room)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="room-profile-grid">
          <div className="room-panel">
            <div className="room-profile-section-title">Room Information</div>
            <div className="room-profile-fields">
              <div className="room-profile-field">
                <span className="room-profile-field-label">Room Number</span>
                <span className="room-profile-field-value">{room.room_number}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Floor</span>
                <span className="room-profile-field-value">{room.floor}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Room Type</span>
                <span className="room-profile-field-value">{room.room_type}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Sharing Type</span>
                <span className="room-profile-field-value">{room.sharing_type}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Hostel</span>
                <span className="room-profile-field-value">
                  {hostelName || `Hostel #${room.hostel_id}`}
                </span>
              </div>
            </div>
          </div>

          <div className="room-panel">
            <div className="room-profile-section-title">Capacity & Pricing</div>
            <div className="room-profile-fields">
              <div className="room-profile-field">
                <span className="room-profile-field-label">Total Beds</span>
                <span className="room-profile-field-value">{room.total_beds}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Available Beds</span>
                <span className="room-profile-field-value">{room.available_beds}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Occupied Beds</span>
                <span className="room-profile-field-value">{occupied}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Monthly Fee</span>
                <span className="room-profile-field-value">
                  ₹{Number(room.monthly_fee || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="room-panel room-profile-grid-full">
            <div className="room-profile-section-title">Description</div>
            <p className="room-profile-description">
              {room.description || "No description provided."}
            </p>
          </div>

          <div className="room-panel room-profile-grid-full">
            <div className="room-profile-section-title">Facilities</div>
            {room.facilities && room.facilities.length > 0 ? (
              <div className="room-facility-chips">
                {room.facilities.map((f) => (
                  <span className="room-facility-chip room-facility-chip-static" key={f}>
                    {f}
                  </span>
                ))}
              </div>
            ) : (
              <p className="room-profile-description">No facilities listed.</p>
            )}
          </div>

          <div className="room-panel room-profile-grid-full">
            <div className="room-profile-section-title">
              Current Occupants {!occupantsLoading && `(${occupants.length})`}
            </div>
            {occupantsLoading ? (
              <p className="room-profile-description">Loading...</p>
            ) : occupants.length === 0 ? (
              <p className="room-profile-description">
                No students currently allocated to this room.
              </p>
            ) : (
              <div className="room-occupants-list">
                {occupants.map((a) => (
                  <Link
                    key={a.id}
                    to={`/students/${a.student_id}`}
                    className="room-occupant-chip"
                  >
                    <span className="room-occupant-name">{a.student_name}</span>
                    <span className="room-occupant-since">
                      since {new Date(a.allocated_date).toLocaleDateString("en-IN")}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteRoomModal
        room={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default RoomDetails;
