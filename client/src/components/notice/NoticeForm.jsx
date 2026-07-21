import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHostels } from "../../services/hostelService";
import { useHostel } from "../../context/HostelContext";

// ==========================================================
// NoticeForm
// Shared Add/Edit form.
//
// Hostel scope: a notice is either GLOBAL (hostel_id = null,
// shows under every hostel) or scoped to ONE specific hostel.
// Defaults to "this hostel" if one is already selected globally
// via the navbar switcher, otherwise defaults to Global.
//
// created_by is required by the backend but is never something
// the admin should type in — it's silently set to the logged-in
// admin's own ID (read from localStorage, set at login).
// ==========================================================

const CATEGORIES = ["General", "Fee", "Maintenance", "Event", "Hostel", "Emergency"];
const PRIORITIES = ["Normal", "Important", "Urgent"];
const STATUSES = ["Active", "Draft", "Expired"];

function getCurrentAdminId() {
  try {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin?.id ?? null;
  } catch {
    return null;
  }
}

function NoticeForm({ initialValues, isEdit = false, onSubmit, submitLabel = "Post Notice" }) {
  const navigate = useNavigate();
  const { selectedHostelId } = useHostel();

  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [category, setCategory] = useState(initialValues?.category || "General");
  const [priority, setPriority] = useState(initialValues?.priority || "Normal");
  const [status, setStatus] = useState(initialValues?.status || "Active");
  const [expiryDate, setExpiryDate] = useState(initialValues?.expiry_date || "");

  const [scope, setScope] = useState(() => {
    if (initialValues) return initialValues.hostel_id ? "specific" : "global";
    return selectedHostelId ? "specific" : "global";
  });
  const [hostelId, setHostelId] = useState(
    initialValues?.hostel_id ? String(initialValues.hostel_id) : selectedHostelId ? String(selectedHostelId) : ""
  );

  const [hostels, setHostels] = useState([]);
  const [hostelsLoading, setHostelsLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllHostels()
      .then((data) => setHostels(data || []))
      .catch(() => {})
      .finally(() => setHostelsLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    if (scope === "specific" && !hostelId) {
      setErrors({ hostel_id: "Please select a hostel, or switch to Global." });
      return;
    }

    const adminId = getCurrentAdminId();
    if (!adminId && !isEdit) {
      setSubmitError(
        "Couldn't determine the logged-in admin. Please log out and back in, then try again."
      );
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      description,
      category,
      priority,
      expiry_date: expiryDate || null,
      hostel_id: scope === "specific" ? Number(hostelId) : null,
      ...(isEdit ? { status } : { created_by: adminId }),
    };

    try {
      await onSubmit(payload);
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
    <form className="fee-form" onSubmit={handleSubmit}>
      {submitError && <div className="fee-form-error-banner">{submitError}</div>}

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">1</span>
          <div>
            <h3>Notice Content</h3>
            <p>What you want to announce.</p>
          </div>
        </div>

        <div className="input-group">
          <label>
            Title<span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 'Water supply maintenance on Sunday'"
            maxLength={200}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="input-group" style={{ marginTop: 16 }}>
          <label>
            Description<span className="required">*</span>
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full details for the notice..."
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </div>
      </div>

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">2</span>
          <div>
            <h3>Classification</h3>
            <p>Category and priority help students scan the notice board quickly.</p>
          </div>
        </div>
        <div className="fee-form-grid">
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
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          {isEdit && (
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
          )}
          <div className="input-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={expiryDate || ""}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <span className="field-helper">
              Optional — auto-marks the notice Expired once passed.
            </span>
          </div>
        </div>
      </div>

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">3</span>
          <div>
            <h3>Visibility</h3>
            <p>Show this to everyone, or just one hostel.</p>
          </div>
        </div>

        <div className="notice-scope-toggle">
          <button
            type="button"
            className={`notice-scope-btn ${scope === "global" ? "active" : ""}`}
            onClick={() => setScope("global")}
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
              <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            All Hostels
          </button>
          <button
            type="button"
            className={`notice-scope-btn ${scope === "specific" ? "active" : ""}`}
            onClick={() => setScope("specific")}
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            One Hostel
          </button>
        </div>

        {scope === "specific" && (
          <div className="input-group" style={{ marginTop: 14, maxWidth: 340 }}>
            <label>
              Hostel<span className="required">*</span>
            </label>
            <select
              value={hostelId}
              onChange={(e) => setHostelId(e.target.value)}
              disabled={hostelsLoading}
              className={errors.hostel_id ? "input-error" : ""}
            >
              <option value="">
                {hostelsLoading ? "Loading hostels..." : "Select Hostel"}
              </option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            {errors.hostel_id && <span className="field-error">{errors.hostel_id}</span>}
          </div>
        )}
      </div>

      <div className="fee-form-actions">
        <button
          type="button"
          className="fee-btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button type="submit" className="fee-btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default NoticeForm;
