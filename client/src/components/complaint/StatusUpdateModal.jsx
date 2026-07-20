import { useState } from "react";
import { updateComplaint } from "../../services/complaintService";
import "../../styles/room.css";
import "../../styles/allocation.css";

const CATEGORIES = [
  "Electricity", "Water", "Food", "Cleaning", "Maintenance", "Security", "Other",
];
const PRIORITIES = ["Low", "Medium", "High", "Emergency"];
const STATUSES = ["Open", "In Progress", "Resolved"];

function StatusUpdateModal({ complaint, onClose, onSuccess }) {
  const [status, setStatus] = useState(complaint.status);
  const [priority, setPriority] = useState(complaint.priority);
  const [category, setCategory] = useState(complaint.category);
  const [adminReply, setAdminReply] = useState(complaint.admin_reply || "");

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      await updateComplaint(complaint.id, {
        status,
        priority,
        category,
        admin_reply: adminReply,
      });
      onSuccess();
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
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
        <h3>Respond to Complaint</h3>
        <p>{complaint.title}</p>

        <form onSubmit={handleSubmit} className="allocation-form">
          {submitError && <div className="room-form-error-banner">{submitError}</div>}

          <div className="input-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Admin Reply</label>
            <textarea
              rows={4}
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              placeholder="Let the student know what's being done..."
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
            <button type="submit" className="room-btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StatusUpdateModal;
