import { useState } from "react";

// ==========================================================
// FacilitiesInput
// Tag-style multi-select used inside RoomForm for the room's
// `facilities` field (stored as a JSON list on the backend,
// e.g. ["WiFi", "AC", "Attached Bathroom"]).
//
// Ships with a handful of common suggestions but also lets the
// admin type a custom facility and press Enter / click Add.
//
// Props:
//  - value: string[]            currently selected facilities
//  - onChange(nextArray): fn    called with the updated list
//  - error: string              optional field-level error
// ==========================================================

const SUGGESTIONS = [
  "WiFi",
  "AC",
  "Attached Bathroom",
  "Geyser",
  "Study Table",
  "Wardrobe",
  "Balcony",
  "TV",
  "Power Backup",
  "Housekeeping",
];

function FacilitiesInput({ value = [], onChange, error }) {
  const [draft, setDraft] = useState("");

  const selected = Array.isArray(value) ? value : [];

  function addFacility(name) {
    const clean = name.trim();
    if (!clean) return;
    if (selected.some((f) => f.toLowerCase() === clean.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...selected, clean]);
    setDraft("");
  }

  function removeFacility(name) {
    onChange(selected.filter((f) => f !== name));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addFacility(draft);
    }
  }

  const remainingSuggestions = SUGGESTIONS.filter(
    (s) => !selected.some((f) => f.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="input-group room-facilities-group">
      <label>Facilities</label>

      {selected.length > 0 && (
        <div className="room-facility-chips">
          {selected.map((f) => (
            <span className="room-facility-chip" key={f}>
              {f}
              <button
                type="button"
                className="room-facility-chip-remove"
                onClick={() => removeFacility(f)}
                aria-label={`Remove ${f}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="room-facilities-add-row">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a facility and press Enter..."
          className={error ? "input-error" : ""}
        />
        <button
          type="button"
          className="room-btn-secondary room-facilities-add-btn"
          onClick={() => addFacility(draft)}
        >
          Add
        </button>
      </div>

      {remainingSuggestions.length > 0 && (
        <div className="room-facility-suggestions">
          {remainingSuggestions.map((s) => (
            <button
              type="button"
              key={s}
              className="room-facility-suggestion"
              onClick={() => addFacility(s)}
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default FacilitiesInput;
