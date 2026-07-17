import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeleteRoomModal from "../../components/room/DeleteRoomModal";
import { getRoomById, deleteRoom, getAllHostels } from "../../services/roomService";
import "../../styles/room.css";

// ==========================================================
// RoomDetails
// Read-only detail view for a single room, with Edit and
// Delete actions. Route: /rooms/:id
// ==========================================================

const STATUS_BADGE = {
  Available: "badge-available",
  Occupied: "badge-occupied",
  Maintenance: "badge-maintenance",
};

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Field({ label, value }) {
  return (
    <div className="room-details-field">
      <span className="room-details-field-label">{label}</span>
      <span className="room-details-field-value">{value || "—"}</span>
    </div>
  );
}

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [hostelName, setHostelName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRoomById(id)
      .then((data) => mounted && setRoom(data))
      .catch((err) => mounted && setErrorMsg(err.message || "Failed to load room"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!room) return;
    let mounted = true;
    getAllHostels()
      .then((data) => {
        if (!mounted) return;
        const match = (data || []).find((h) => h.id === room.hostel_id);
        setHostelName(match?.title || "");
      })
      .catch(() => {
        // Non-fatal — details still render, just without a hostel name.
      });
    return () => {
      mounted = false;
    };
  }, [room]);

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await deleteRoom(id);
      navigate("/rooms", { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete room");
      setDeleteTarget(null);
    } finally {
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

  if (errorMsg && !room) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <button className="room-back-link" onClick={() => navigate("/rooms")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Rooms
          </button>
          <div className="room-page-error">{errorMsg}</div>
        </div>
      </DashboardLayout>
    );
  }

  const occupiedBeds = Math.max(0, (room.total_beds || 0) - (room.available_beds || 0));
  const occupancyPct = room.total_beds ? Math.round((occupiedBeds / room.total_beds) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="room-page">
        <button className="room-back-link" onClick={() => navigate("/rooms")}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Rooms
        </button>

        {errorMsg && <div className="room-page-error">{errorMsg}</div>}

        {/* ---------- Room header card ---------- */}
        <div className="room-details-header">
          <div className="room-details-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="room-details-heading">
            <h1>Room {room.room_number}</h1>
            <div className="room-details-meta">
              <span>{room.room_type} · {room.sharing_type} · {hostelName || "Unknown Hostel"}</span>
              <span className={`room-badge ${STATUS_BADGE[room.status] || ""}`}>
                {room.status}
              </span>
            </div>
          </div>

          <div className="room-details-actions">
            <button
              className="room-btn-secondary"
              onClick={() => navigate(`/rooms/${id}/edit`)}
            >
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
            <button className="room-btn-danger" onClick={() => setDeleteTarget(room)}>
              Delete
            </button>
          </div>
        </div>

        {/* ---------- Detail sections ---------- */}
        <div className="room-details-grid">
          <div className="room-panel">
            <h3 className="room-details-section-title">Basic Information</h3>
            <div className="room-details-fields">
              <Field label="Hostel" value={hostelName || "Unknown Hostel"} />
              <Field label="Room Number" value={room.room_number} />
              <Field label="Floor" value={room.floor} />
              <Field label="Room Type" value={room.room_type} />
              <Field label="Sharing Type" value={room.sharing_type} />
            </div>
          </div>

          <div className="room-panel">
            <h3 className="room-details-section-title">Capacity &amp; Occupancy</h3>
            <div className="room-details-fields">
              <Field label="Total Beds" value={room.total_beds} />
              <Field label="Available Beds" value={room.available_beds} />
              <Field label="Occupied Beds" value={occupiedBeds} />
              <div className="room-details-field">
                <span className="room-details-field-label">Occupancy</span>
                <span className="room-details-field-value">{occupancyPct}%</span>
              </div>
            </div>
            <div className="room-occupancy-track">
              <div className="room-occupancy-fill" style={{ width: `${occupancyPct}%` }} />
            </div>
          </div>

          <div className="room-panel">
            <h3 className="room-details-section-title">Pricing &amp; Status</h3>
            <div className="room-details-fields">
              <Field label="Monthly Fee" value={formatCurrency(room.monthly_fee)} />
              <div className="room-details-field">
                <span className="room-details-field-label">Status</span>
                <span className={`room-badge ${STATUS_BADGE[room.status] || ""}`}>{room.status}</span>
              </div>
              <Field label="Created On" value={formatDate(room.created_at)} />
              <Field label="Last Updated" value={formatDate(room.updated_at)} />
            </div>
          </div>

          <div className="room-panel">
            <h3 className="room-details-section-title">Facilities</h3>
            {room.facilities && room.facilities.length > 0 ? (
              <div className="room-details-facilities">
                {room.facilities.map((f) => (
                  <span className="room-details-facility-pill" key={f}>{f}</span>
                ))}
              </div>
            ) : (
              <p className="room-details-description">No facilities listed for this room.</p>
            )}
          </div>

          <div className="room-panel">
            <h3 className="room-details-section-title">Description</h3>
            <p className="room-details-description">
              {room.description || "No description provided for this room."}
            </p>
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
