import { useState } from "react";
import { vacateRoom } from "../../services/allocationService";
import "../../styles/room.css";
import "../../styles/allocation.css";

// ==========================================================
// VacateRoomModal
// Confirms vacating a student's current room. The room's
// available_beds is incremented automatically on the backend.
// ==========================================================

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function VacateRoomModal({ student, onClose, onSuccess }) {
  const [date, setDate] = useState(todayISO());
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");
    setSubmitting(true);

    try {
      await vacateRoom(student.id, {
        vacated_date: date,
        remarks: remarks || undefined,
      });
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
        <h3>Vacate Room</h3>
        <p>
          {student.room_number
            ? `${student.full_name} will be removed from room ${student.room_number}. This frees up a bed there.`
            : `Remove ${student.full_name} from their current room.`}
        </p>

        <form onSubmit={handleSubmit} className="allocation-form">
          {submitError && <div className="room-form-error-banner">{submitError}</div>}

          <div className="input-group">
            <label>
              Vacated Date<span className="required">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.vacated_date ? "input-error" : ""}
            />
            {errors.vacated_date && (
              <span className="field-error">{errors.vacated_date}</span>
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
            <button type="submit" className="room-btn-danger" disabled={submitting}>
              {submitting ? "Saving..." : "Vacate Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VacateRoomModal;
