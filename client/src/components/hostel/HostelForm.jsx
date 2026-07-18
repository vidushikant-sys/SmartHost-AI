import { useState, useEffect } from "react";
import { HOSTEL_TYPES } from "../../services/hostelService";

const EMPTY_FORM = {
  title: "",
  description: "",
  hostel_type: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  monthly_fee: "",
  total_capacity: "",
  bedrooms: "0",
  bathrooms: "0",
  amenities: [],
};

const SUGGESTED_AMENITIES = [
  "WiFi",
  "AC",
  "Power Backup",
  "Hot Water",
  "Laundry",
  "Mess / Food",
  "Housekeeping",
  "Parking",
  "CCTV Security",
  "Gym",
  "Study Room",
  "Common TV Lounge",
];

/**
 * Mirrors server/validators/hostel_validator.py exactly so the person gets
 * instant feedback instead of a round trip to the server for obvious
 * mistakes. The server remains the source of truth — its errors (passed in
 * via `serverErrors`) are merged in and always win.
 */
function validate(form) {
  const errors = {};

  const title = form.title.trim();
  if (!title) errors.title = "Hostel title is required.";
  else if (title.length < 3)
    errors.title = "Hostel title must be at least 3 characters.";

  const description = form.description.trim();
  if (!description) errors.description = "Description is required.";
  else if (description.length < 10)
    errors.description = "Description must be at least 10 characters.";

  if (!form.hostel_type) {
    errors.hostel_type = "Hostel type is required.";
  } else if (!HOSTEL_TYPES.includes(form.hostel_type)) {
    errors.hostel_type =
      "Hostel type must be Boys Hostel, Girls Hostel, PG or Apartment.";
  }

  if (!form.address.trim()) errors.address = "Address is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.state.trim()) errors.state = "State is required.";
  if (!form.country.trim()) errors.country = "Country is required.";

  const pincode = form.pincode.trim();
  if (!pincode) errors.pincode = "Pincode is required.";
  else if (!/^\d{6}$/.test(pincode))
    errors.pincode = "Pincode must be exactly 6 digits.";

  if (form.monthly_fee === "" || form.monthly_fee === null) {
    errors.monthly_fee = "Monthly fee is required.";
  } else if (isNaN(Number(form.monthly_fee)) || Number(form.monthly_fee) <= 0) {
    errors.monthly_fee = "Monthly fee must be a number greater than 0.";
  }

  if (form.total_capacity === "" || form.total_capacity === null) {
    errors.total_capacity = "Total capacity is required.";
  } else if (
    !Number.isInteger(Number(form.total_capacity)) ||
    Number(form.total_capacity) <= 0
  ) {
    errors.total_capacity = "Total capacity must be a whole number greater than 0.";
  }

  if (form.bedrooms !== "" && (!Number.isInteger(Number(form.bedrooms)) || Number(form.bedrooms) < 0)) {
    errors.bedrooms = "Bedrooms cannot be negative.";
  }

  if (form.bathrooms !== "" && (!Number.isInteger(Number(form.bathrooms)) || Number(form.bathrooms) < 0)) {
    errors.bathrooms = "Bathrooms cannot be negative.";
  }

  return errors;
}

/**
 * @param {object} props
 * @param {object} [props.initialData] - existing hostel data, for edit mode
 * @param {(payload: object) => void} props.onSubmit
 * @param {boolean} [props.submitting]
 * @param {object} [props.serverErrors] - field-keyed errors returned by the API
 * @param {string} [props.submitLabel]
 */
export default function HostelForm({
  initialData,
  onSubmit,
  submitting = false,
  serverErrors = {},
  submitLabel = "Save Hostel",
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [customAmenity, setCustomAmenity] = useState("");
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        hostel_type: initialData.hostel_type || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        pincode: initialData.pincode ? String(initialData.pincode) : "",
        monthly_fee:
          initialData.monthly_fee !== undefined && initialData.monthly_fee !== null
            ? String(initialData.monthly_fee)
            : "",
        total_capacity:
          initialData.total_capacity !== undefined && initialData.total_capacity !== null
            ? String(initialData.total_capacity)
            : "",
        bedrooms:
          initialData.bedrooms !== undefined && initialData.bedrooms !== null
            ? String(initialData.bedrooms)
            : "0",
        bathrooms:
          initialData.bathrooms !== undefined && initialData.bathrooms !== null
            ? String(initialData.bathrooms)
            : "0",
        amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
      });
    }
  }, [initialData]);

  const errors = { ...clientErrors, ...serverErrors };

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setClientErrors(validate(form));
  }

  function toggleAmenity(name) {
    setForm((prev) => {
      const has = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: has
          ? prev.amenities.filter((a) => a !== name)
          : [...prev.amenities, name],
      };
    });
  }

  function addCustomAmenity() {
    const value = customAmenity.trim();
    if (!value || form.amenities.includes(value)) {
      setCustomAmenity("");
      return;
    }
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    setCustomAmenity("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setClientErrors(validationErrors);
    setTouched({
      title: true,
      description: true,
      hostel_type: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pincode: true,
      monthly_fee: true,
      total_capacity: true,
      bedrooms: true,
      bathrooms: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      hostel_type: form.hostel_type,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      pincode: form.pincode.trim(),
      monthly_fee: Number(form.monthly_fee),
      total_capacity: Number(form.total_capacity),
      bedrooms: form.bedrooms === "" ? 0 : Number(form.bedrooms),
      bathrooms: form.bathrooms === "" ? 0 : Number(form.bathrooms),
      amenities: form.amenities,
    });
  }

  const showError = (field) => touched[field] && errors[field];

  return (
    <form className="hostel-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="hostel-form__section">
        <legend>Basic Information</legend>

        <div className="hostel-form__row">
          <label className="hostel-form__field hostel-form__field--wide">
            <span>Hostel Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="e.g. Sunrise Boys Hostel"
              className={showError("title") ? "is-invalid" : ""}
            />
            {showError("title") && <small className="hostel-form__error">{errors.title}</small>}
          </label>

          <label className="hostel-form__field">
            <span>Hostel Type</span>
            <select
              value={form.hostel_type}
              onChange={(e) => handleChange("hostel_type", e.target.value)}
              onBlur={() => handleBlur("hostel_type")}
              className={showError("hostel_type") ? "is-invalid" : ""}
            >
              <option value="">Select type</option>
              {HOSTEL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {showError("hostel_type") && (
              <small className="hostel-form__error">{errors.hostel_type}</small>
            )}
          </label>
        </div>

        <label className="hostel-form__field hostel-form__field--wide">
          <span>Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Tell prospective residents what makes this hostel worth choosing..."
            className={showError("description") ? "is-invalid" : ""}
          />
          {showError("description") && (
            <small className="hostel-form__error">{errors.description}</small>
          )}
        </label>
      </fieldset>

      <fieldset className="hostel-form__section">
        <legend>Location</legend>

        <label className="hostel-form__field hostel-form__field--wide">
          <span>Address</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            placeholder="Street, landmark, area"
            className={showError("address") ? "is-invalid" : ""}
          />
          {showError("address") && <small className="hostel-form__error">{errors.address}</small>}
        </label>

        <div className="hostel-form__row hostel-form__row--four">
          <label className="hostel-form__field">
            <span>City</span>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              className={showError("city") ? "is-invalid" : ""}
            />
            {showError("city") && <small className="hostel-form__error">{errors.city}</small>}
          </label>

          <label className="hostel-form__field">
            <span>State</span>
            <input
              type="text"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              onBlur={() => handleBlur("state")}
              className={showError("state") ? "is-invalid" : ""}
            />
            {showError("state") && <small className="hostel-form__error">{errors.state}</small>}
          </label>

          <label className="hostel-form__field">
            <span>Country</span>
            <input
              type="text"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              onBlur={() => handleBlur("country")}
              className={showError("country") ? "is-invalid" : ""}
            />
            {showError("country") && <small className="hostel-form__error">{errors.country}</small>}
          </label>

          <label className="hostel-form__field">
            <span>Pincode</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
              onBlur={() => handleBlur("pincode")}
              className={showError("pincode") ? "is-invalid" : ""}
            />
            {showError("pincode") && <small className="hostel-form__error">{errors.pincode}</small>}
          </label>
        </div>
      </fieldset>

      <fieldset className="hostel-form__section">
        <legend>Capacity &amp; Pricing</legend>

        <div className="hostel-form__row hostel-form__row--four">
          <label className="hostel-form__field">
            <span>Monthly Fee (₹)</span>
            <input
              type="number"
              min="1"
              step="1"
              value={form.monthly_fee}
              onChange={(e) => handleChange("monthly_fee", e.target.value)}
              onBlur={() => handleBlur("monthly_fee")}
              className={showError("monthly_fee") ? "is-invalid" : ""}
            />
            {showError("monthly_fee") && (
              <small className="hostel-form__error">{errors.monthly_fee}</small>
            )}
          </label>

          <label className="hostel-form__field">
            <span>Total Capacity (beds)</span>
            <input
              type="number"
              min="1"
              step="1"
              value={form.total_capacity}
              onChange={(e) => handleChange("total_capacity", e.target.value)}
              onBlur={() => handleBlur("total_capacity")}
              className={showError("total_capacity") ? "is-invalid" : ""}
            />
            {showError("total_capacity") && (
              <small className="hostel-form__error">{errors.total_capacity}</small>
            )}
          </label>

          <label className="hostel-form__field">
            <span>Bedrooms</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.bedrooms}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
              onBlur={() => handleBlur("bedrooms")}
              className={showError("bedrooms") ? "is-invalid" : ""}
            />
            {showError("bedrooms") && <small className="hostel-form__error">{errors.bedrooms}</small>}
          </label>

          <label className="hostel-form__field">
            <span>Bathrooms</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.bathrooms}
              onChange={(e) => handleChange("bathrooms", e.target.value)}
              onBlur={() => handleBlur("bathrooms")}
              className={showError("bathrooms") ? "is-invalid" : ""}
            />
            {showError("bathrooms") && <small className="hostel-form__error">{errors.bathrooms}</small>}
          </label>
        </div>
      </fieldset>

      <fieldset className="hostel-form__section">
        <legend>Amenities</legend>

        <div className="hostel-form__amenities">
          {SUGGESTED_AMENITIES.map((amenity) => (
            <button
              type="button"
              key={amenity}
              className={
                "hostel-chip-toggle" +
                (form.amenities.includes(amenity) ? " is-active" : "")
              }
              onClick={() => toggleAmenity(amenity)}
            >
              {amenity}
            </button>
          ))}
        </div>

        <div className="hostel-form__row">
          <label className="hostel-form__field hostel-form__field--wide">
            <span>Add a custom amenity</span>
            <div className="hostel-form__inline-add">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomAmenity();
                  }
                }}
                placeholder="e.g. Rooftop Lounge"
              />
              <button type="button" className="btn btn--ghost" onClick={addCustomAmenity}>
                Add
              </button>
            </div>
          </label>
        </div>

        {form.amenities.length > 0 && (
          <div className="hostel-form__selected-amenities">
            {form.amenities.map((amenity) => (
              <span className="hostel-chip" key={amenity}>
                {amenity}
                <button
                  type="button"
                  aria-label={`Remove ${amenity}`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </fieldset>

      <div className="hostel-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
