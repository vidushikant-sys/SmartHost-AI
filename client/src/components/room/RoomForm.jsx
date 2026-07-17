import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../ui/InputField";
import FacilitiesInput from "./FacilitiesInput";
import { getAllHostels } from "../../services/roomService";

// ==========================================================
// RoomForm
// Shared, sectioned form used by both the "Add Room" and
// "Edit Room" pages. The parent page owns the actual save
// call — this component only collects + validates input.
//
// Props:
//  - initialValues: object (prefilled for edit, {} for add)
//  - onSubmit(values): async fn — throws with .errors on failure
//  - submitLabel: string
// ==========================================================

const EMPTY_FORM = {
  hostel_id: "",
  room_number: "",
  floor: "",
  room_type: "",
  sharing_type: "",
  total_beds: "",
  available_beds: "",
  monthly_fee: "",
  status: "Available",
  description: "",
  facilities: [],
};

function RoomForm({ initialValues, onSubmit, submitLabel = "Save Room" }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [hostels, setHostels] = useState([]);
  const [hostelsLoading, setHostelsLoading] = useState(true);
  const [hostelsError, setHostelsError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      setForm({ ...EMPTY_FORM, ...initialValues });
    }
  }, [initialValues]);

  useEffect(() => {
    let mounted = true;
    getAllHostels()
      .then((data) => mounted && setHostels(data || []))
      .catch((err) => mounted && setHostelsError(err.message || "Failed to load hostels"))
      .finally(() => mounted && setHostelsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFacilitiesChange(next) {
    setForm((f) => ({ ...f, facilities: next }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSubmitError("");
    try {
      // Coerce numeric fields before sending — inputs store strings.
      const payload = {
        ...form,
        hostel_id: form.hostel_id === "" ? "" : Number(form.hostel_id),
        floor: form.floor === "" ? "" : Number(form.floor),
        total_beds: form.total_beds === "" ? "" : Number(form.total_beds),
        available_beds: form.available_beds === "" ? "" : Number(form.available_beds),
        monthly_fee: form.monthly_fee === "" ? "" : Number(form.monthly_fee),
      };
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
    <form className="room-form" onSubmit={handleSubmit}>
      {submitError && <div className="room-form-error-banner">{submitError}</div>}
      {hostelsError && <div className="room-form-error-banner">{hostelsError}</div>}

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">1</span>
          <div>
            <h3>Basic Information</h3>
            <p>Which hostel this room belongs to, and how it's identified.</p>
          </div>
        </div>
        <div className="room-form-grid">
          <div className="input-group">
            <label htmlFor="hostel_id">
              Hostel<span className="required">*</span>
            </label>
            <select
              id="hostel_id"
              name="hostel_id"
              value={form.hostel_id || ""}
              onChange={handleChange}
              disabled={hostelsLoading}
              className={errors.hostel_id ? "input-error" : ""}
            >
              <option value="">{hostelsLoading ? "Loading hostels..." : "Select Hostel"}</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            {errors.hostel_id && <span className="field-error">{errors.hostel_id}</span>}
          </div>

          <InputField label="Room Number" name="room_number" value={form.room_number} onChange={handleChange} error={errors.room_number} required />
          <InputField label="Floor" type="number" name="floor" value={form.floor} onChange={handleChange} error={errors.floor} required />
          <InputField
            label="Room Type"
            as="select"
            name="room_type"
            value={form.room_type}
            onChange={handleChange}
            options={["Standard", "Deluxe", "Premium", "AC", "Non AC"]}
            error={errors.room_type}
            required
          />
          <InputField
            label="Sharing Type"
            as="select"
            name="sharing_type"
            value={form.sharing_type}
            onChange={handleChange}
            options={["Single", "Double", "Triple", "Four Sharing"]}
            error={errors.sharing_type}
            required
          />
        </div>
      </div>

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">2</span>
          <div>
            <h3>Capacity, Pricing &amp; Status</h3>
            <p>Bed count, monthly fee and the room's current availability.</p>
          </div>
        </div>
        <div className="room-form-grid-3col">
          <InputField label="Total Beds" type="number" name="total_beds" value={form.total_beds} onChange={handleChange} error={errors.total_beds} required />
          <InputField label="Available Beds" type="number" name="available_beds" value={form.available_beds} onChange={handleChange} error={errors.available_beds} required />
          <InputField label="Monthly Fee (₹)" type="number" name="monthly_fee" value={form.monthly_fee} onChange={handleChange} error={errors.monthly_fee} required />
        </div>
        <div className="room-form-grid" style={{ marginTop: 18 }}>
          <InputField
            label="Status"
            as="select"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["Available", "Occupied", "Maintenance"]}
            error={errors.status}
            required
          />
        </div>
      </div>

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">3</span>
          <div>
            <h3>Facilities</h3>
            <p>Select or add the amenities available in this room.</p>
          </div>
        </div>
        <FacilitiesInput value={form.facilities || []} onChange={handleFacilitiesChange} />
        {errors.facilities && <span className="field-error">{errors.facilities}</span>}
      </div>

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">4</span>
          <div>
            <h3>Description</h3>
            <p>Any additional notes about the room (optional).</p>
          </div>
        </div>
        <div className="room-form-grid">
          <InputField
            label="Description"
            as="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />
        </div>
      </div>

      <div className="room-form-actions">
        <button type="button" className="room-btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="room-btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;
