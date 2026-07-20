import { useEffect, useMemo, useState } from "react";
import { getAllHostels } from "../../services/hostelService";
import { getAllRooms } from "../../services/roomService";
import { allocateRoom, transferRoom } from "../../services/allocationService";
import "../../styles/room.css";
import "../../styles/allocation.css";

// ==========================================================
// AllocateRoomModal
// One modal, two modes:
//  - mode="allocate": student has no active room yet
//  - mode="transfer":  student already has a room, moving them
//                       to a different one (old room is auto-freed,
//                       new room is auto-reserved, backend handles it)
//
// Props:
//  - student: the student object (needs .id, .full_name)
//  - mode: "allocate" | "transfer"
//  - onClose(): fn
//  - onSuccess(): fn — called after a successful allocate/transfer
// ==========================================================

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function AllocateRoomModal({ student, mode = "allocate", onClose, onSuccess }) {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hostelId, setHostelId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [remarks, setRemarks] = useState("");

  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllHostels()
      .then((data) => setHostels(data || []))
      .catch((err) => setSubmitError(err.message || "Failed to load hostels"))
      .finally(() => setLoadingHostels(false));
  }, []);

  useEffect(() => {
    if (!hostelId) {
      setRooms([]);
      setRoomId("");
      return;
    }
    setLoadingRooms(true);
    setRoomId("");
    getAllRooms(Number(hostelId))
      .then((data) => setRooms(data || []))
      .catch((err) => setSubmitError(err.message || "Failed to load rooms"))
      .finally(() => setLoadingRooms(false));
  }, [hostelId]);

  // Only rooms that can actually take another student.
  const availableRooms = useMemo(
    () => rooms.filter((r) => r.status !== "Maintenance" && r.available_beds > 0),
    [rooms]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    if (!roomId) {
      setErrors({ room_id: "Please select a room." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        student_id: student.id,
        room_id: Number(roomId),
        allocated_date: date,
        remarks: remarks || undefined,
      };

      if (mode === "transfer") {
        await transferRoom(student.id, payload);
      } else {
        await allocateRoom(payload);
      }

      onSuccess();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setSubmitError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="room-modal-overlay" onClick={onClose}>
      <div
        className="room-modal-box allocation-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{mode === "transfer" ? "Transfer Room" : "Allocate Room"}</h3>
        <p>
          {mode === "transfer"
            ? `Move ${student.full_name} to a different room. Their current room will be freed up automatically.`
            : `Assign ${student.full_name} to a room.`}
        </p>

        <form onSubmit={handleSubmit} className="allocation-form">
          {submitError && <div className="room-form-error-banner">{submitError}</div>}

          <div className="input-group">
            <label>
              Hostel<span className="required">*</span>
            </label>
            <select
              value={hostelId}
              onChange={(e) => setHostelId(e.target.value)}
              disabled={loadingHostels}
            >
              <option value="">
                {loadingHostels ? "Loading hostels..." : "Select Hostel"}
              </option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>
              Room<span className="required">*</span>
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={!hostelId || loadingRooms}
              className={errors.room_id ? "input-error" : ""}
            >
              <option value="">
                {!hostelId
                  ? "Select a hostel first"
                  : loadingRooms
                  ? "Loading rooms..."
                  : availableRooms.length === 0
                  ? "No available rooms in this hostel"
                  : "Select Room"}
              </option>
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.room_number} — {r.room_type}, {r.available_beds} bed(s) free
                </option>
              ))}
            </select>
            {errors.room_id && <span className="field-error">{errors.room_id}</span>}
          </div>

          <div className="input-group">
            <label>
              {mode === "transfer" ? "Transfer Date" : "Allocated Date"}
              <span className="required">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.allocated_date ? "input-error" : ""}
            />
            {errors.allocated_date && (
              <span className="field-error">{errors.allocated_date}</span>
            )}
          </div>

          <div className="input-group">
            <label>Remarks</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional note..."
            />
            {errors.remarks && <span className="field-error">{errors.remarks}</span>}
          </div>

          <div className="room-modal-actions">
            <button
              type="button"
              className="room-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="room-btn-primary" disabled={submitting}>
              {submitting
                ? "Saving..."
                : mode === "transfer"
                ? "Transfer"
                : "Allocate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AllocateRoomModal;
