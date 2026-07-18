import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../ui/InputField";
import FacilitiesInput from "./FacilitiesInput";
import { getAllHostels } from "../../services/hostelService";
import { useHostel } from "../../context/HostelContext";

// ==========================================================
// RoomForm
// Shared, sectioned form used by both "Add Room" and
// "Edit Room" pages. The parent page owns the actual save
// call — this component only collects + validates input and
// shapes the payload to match what the Flask backend expects
// (server/validators/room_validator.py + models/room.py).
//
// Two behaviours worth calling out:
//
// 1. HOSTEL FIELD — when a hostel is globally selected (via the
//    navbar switcher / HostelContext), a *new* room is created
//    directly under that hostel — no need to pick it again, so
//    the field is shown locked/read-only. If "All Hostels" is
//    selected, the picker is shown as normal. When editing an
//    existing room, the hostel is always shown locked to that
//    room's actual hostel (moving a room between hostels isn't
//    something this form supports).
//
// 2. BEDS — "Available Beds" auto-follows "Total Beds" until the
//    admin manually edits Available Beds themselves (useful when
//    adding a brand new room, which starts fully vacant). A live
//    inline warning shows if Available Beds ever exceeds Total
//    Beds, instead of only finding out after submitting.
//
// Props:
//  - initialValues: object (prefilled for edit, {} for add)
//  - isEdit: boolean — true on the Edit Room page
//  - onSubmit(values): async fn — throws with .errors on failure
//  - submitLabel: string
// ==========================================================

const EMPTY_FORM = {
  hostel_id: "",
  room_number: "",
  floor: "",
  room_type: "",
  sharing_type: "",
  monthly_fee: "",
  total_beds: "",
  available_beds: "",
  status: "Available",
  description: "",
  facilities: [],
};

const ROOM_TYPES = ["Standard", "Deluxe", "Premium", "AC", "Non AC"];
const SHARING_TYPES = ["Single", "Double", "Triple", "Four Sharing"];
const STATUS_OPTIONS = ["Available", "Occupied", "Maintenance"];

function RoomForm({ initialValues, isEdit = false, onSubmit, submitLabel = "Save Room" }) {
  const { selectedHostelId, selectedHostel, hostels: hostelsFromContext } = useHostel();

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...initialValues,
    // Brand new room + a specific hostel already selected globally ->
    // lock straight into that hostel, no picking needed.
    hostel_id:
      !isEdit && selectedHostelId
        ? String(selectedHostelId)
        : initialValues?.hostel_id ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [hostels, setHostels] = useState(hostelsFromContext || []);
  const [hostelsLoading, setHostelsLoading] = useState(
    (hostelsFromContext || []).length === 0
  );
  const [hostelsError, setHostelsError] = useState("");

  // Tracks whether the admin has manually typed into "Available Beds"
  // themselves — once they have, we stop auto-syncing it to Total Beds.
  const availableBedsTouched = useRef(isEdit); // edits start "touched" so we never clobber existing data

  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      setForm((f) => ({
        ...EMPTY_FORM,
        ...initialValues,
        hostel_id:
          !isEdit && selectedHostelId
            ? String(selectedHostelId)
            : initialValues.hostel_id ?? f.hostel_id,
        facilities: Array.isArray(initialValues.facilities)
          ? initialValues.facilities
          : [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  // Only fetch the hostel list ourselves if HostelContext hasn't
  // already loaded it (avoids a duplicate request in the common case).
  useEffect(() => {
    if (hostelsFromContext && hostelsFromContext.length > 0) {
      setHostels(hostelsFromContext);
      setHostelsLoading(false);
      return;
    }
    getAllHostels()
      .then((data) => setHostels(data || []))
      .catch((err) => setHostelsError(err.message || "Failed to load hostels"))
      .finally(() => setHostelsLoading(false));
  }, [hostelsFromContext]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "available_beds") {
      availableBedsTouched.current = true;
    }

    setForm((f) => {
      const next = { ...f, [name]: value };

      // Keep "Available Beds" following "Total Beds" for a fresh room,
      // right up until the admin edits Available Beds themselves.
      if (name === "total_beds" && !availableBedsTouched.current) {
        next.available_beds = value;
      }

      return next;
    });
  }

  function handleFacilitiesChange(nextFacilities) {
    setForm((f) => ({ ...f, facilities: nextFacilities }));
  }

  const totalBedsNum = Number(form.total_beds);
  const availableBedsNum = Number(form.available_beds);
  const bedsExceedWarning =
    form.total_beds !== "" &&
    form.available_beds !== "" &&
    !Number.isNaN(totalBedsNum) &&
    !Number.isNaN(availableBedsNum) &&
    availableBedsNum > totalBedsNum;

  async function handleSubmit(e) {
    e.preventDefault();

    if (bedsExceedWarning) {
      setErrors((prev) => ({
        ...prev,
        available_beds: "Available beds cannot exceed total beds.",
      }));
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSubmitError("");

    // Shape the payload — convert numeric strings to real numbers so
    // the backend's validator + SQLAlchemy columns receive clean types.
    const payload = {
      ...form,
      hostel_id: form.hostel_id === "" ? "" : Number(form.hostel_id),
      floor: form.floor === "" ? "" : Number(form.floor),
      total_beds: form.total_beds === "" ? "" : Number(form.total_beds),
      available_beds: form.available_beds === "" ? "" : Number(form.available_beds),
      monthly_fee: form.monthly_fee === "" ? "" : Number(form.monthly_fee),
      facilities: form.facilities || [],
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

  const hostelOptions = hostels.map((h) => ({
    value: String(h.id),
    label: h.title,
  }));

  // The hostel field is locked (read-only display) whenever:
  //  - we're editing an existing room (its hostel is fixed), or
  //  - we're adding a new room AND a specific hostel is globally selected
  const isHostelLocked = isEdit || (!isEdit && !!selectedHostelId);

  const lockedHostelName = isEdit
    ? hostels.find((h) => String(h.id) === String(form.hostel_id))?.title
    : selectedHostel?.title;

  return (
    <form className="room-form" onSubmit={handleSubmit}>
      {submitError && <div className="room-form-error-banner">{submitError}</div>}
      {hostelsError && <div className="room-form-error-banner">{hostelsError}</div>}

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">1</span>
          <div>
            <h3>Basic Information</h3>
            <p>Which hostel this room belongs to, and its identifiers.</p>
          </div>
        </div>
        <div className="room-form-grid">
          <div className="input-group">
            <label htmlFor="hostel_id">
              Hostel<span className="required">*</span>
            </label>

            {isHostelLocked ? (
              <>
                <div className="room-hostel-locked">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    {hostelsLoading
                      ? "Loading..."
                      : lockedHostelName || `Hostel #${form.hostel_id}`}
                  </span>
                  <span className="room-hostel-locked-badge">
                    {isEdit ? "Fixed" : "From global filter"}
                  </span>
                </div>
                {!isEdit && (
                  <span className="field-helper">
                    Switch hostels from the navbar selector to add a room
                    elsewhere.
                  </span>
                )}
              </>
            ) : (
              <select
                id="hostel_id"
                name="hostel_id"
                value={form.hostel_id || ""}
                onChange={handleChange}
                disabled={hostelsLoading}
                className={errors.hostel_id ? "input-error" : ""}
              >
                <option value="">
                  {hostelsLoading ? "Loading hostels..." : "Select Hostel"}
                </option>
                {hostelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {errors.hostel_id && <span className="field-error">{errors.hostel_id}</span>}
          </div>

          <InputField
            label="Room Number"
            name="room_number"
            value={form.room_number}
            onChange={handleChange}
            error={errors.room_number}
            required
          />
          <InputField
            label="Floor"
            type="number"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            error={errors.floor}
            helperText="0 = Ground floor"
            required
          />
          <InputField
            label="Room Type"
            as="select"
            name="room_type"
            value={form.room_type}
            onChange={handleChange}
            options={ROOM_TYPES}
            error={errors.room_type}
            required
          />
          <InputField
            label="Sharing Type"
            as="select"
            name="sharing_type"
            value={form.sharing_type}
            onChange={handleChange}
            options={SHARING_TYPES}
            error={errors.sharing_type}
            required
          />
        </div>
      </div>

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">2</span>
          <div>
            <h3>Capacity & Pricing</h3>
            <p>Bed count, availability and the monthly fee for this room.</p>
          </div>
        </div>
        <div className="room-form-grid">
          <InputField
            label="Total Beds"
            type="number"
            name="total_beds"
            value={form.total_beds}
            onChange={handleChange}
            error={errors.total_beds}
            required
          />
          <InputField
            label="Available Beds"
            type="number"
            name="available_beds"
            value={form.available_beds}
            onChange={handleChange}
            error={errors.available_beds || (bedsExceedWarning ? "Available beds cannot exceed total beds." : "")}
            helperText={
              !isEdit && !availableBedsTouched.current
                ? "Follows Total Beds automatically until you edit it"
                : ""
            }
            required
          />
          <InputField
            label="Monthly Fee (₹)"
            type="number"
            name="monthly_fee"
            value={form.monthly_fee}
            onChange={handleChange}
            error={errors.monthly_fee}
            required
          />
          <InputField
            label="Status"
            as="select"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            error={errors.status}
            required
          />
        </div>
      </div>

      <div className="room-form-section">
        <div className="room-form-section-header">
          <span className="room-form-section-num">3</span>
          <div>
            <h3>Extra Details</h3>
            <p>Description and facilities available in this room.</p>
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
          <FacilitiesInput
            value={form.facilities}
            onChange={handleFacilitiesChange}
            error={errors.facilities}
          />
        </div>
      </div>

      <div className="room-form-actions">
        <button
          type="button"
          className="room-btn-secondary"
          onClick={() => navigate(-1)}
        >
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
