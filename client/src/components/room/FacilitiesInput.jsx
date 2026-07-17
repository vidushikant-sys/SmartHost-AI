import { useState } from "react";

// ==========================================================
// FacilitiesInput
// Reusable chip-style selector for the room's `facilities`
// field (stored as a JSON list on the backend, e.g.
// ["WiFi", "Attached Bathroom", "AC"]).
//
// - Click a suggestion to toggle it on/off.
// - Type a custom facility and press Enter / click Add.
// - Each selected facility renders as a removable chip.
//
// Props:
//  - value: string[]        (currently selected facilities)
//  - onChange(next: string[])
// ==========================================================

const SUGGESTIONS = [
  "WiFi",
  "AC",
  "Attached Bathroom",
  "Balcony",
  "Study Table",
  "Wardrobe",
  "Geyser",
  "TV",
  "Power Backup",
  "Housekeeping",
];

function FacilitiesInput({ value = [], onChange }) {
  const [customInput, setCustomInput] = useState("");

  function toggleSuggestion(item) {
    if (value.includes(item)) {
      onChange(value.filter((f) => f !== item));
    } else {
      onChange([...value, item]);
    }
  }

  function addCustom() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!value.some((f) => f.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...value, trimmed]);
    }
    setCustomInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  }

  function removeChip(item) {
    onChange(value.filter((f) => f !== item));
  }

  return (
    <div className="room-facilities-box">
      <div className="room-facilities-suggestions">
        {SUGGESTIONS.map((item) => (
          <button
            type="button"
            key={item}
            className={`room-facility-suggestion ${value.includes(item) ? "selected" : ""}`}
            onClick={() => toggleSuggestion(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="room-facilities-input-row">
        <input
          type="text"
          placeholder="Add a custom facility and press Enter..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="room-facilities-add-btn" onClick={addCustom}>
          Add
        </button>
      </div>

      {value.length > 0 ? (
        <div className="room-facilities-chips">
          {value.map((item) => (
            <span className="room-facility-chip" key={item}>
              {item}
              <button
                type="button"
                className="room-facility-chip-remove"
                onClick={() => removeChip(item)}
                title={`Remove ${item}`}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      ) : (
        <span className="room-facilities-empty">No facilities selected yet.</span>
      )}
    </div>
  );
}

export default FacilitiesInput;
