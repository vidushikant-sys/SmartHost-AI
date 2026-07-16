import "../../styles/forms.css";

// ==========================================================
// InputField
// Reusable controlled field used across Login, Student form,
// and every future module form.
//
// Props:
//  - label, name, value, onChange, placeholder, error
//  - type: "text" | "email" | "password" | "date" | ...
//  - as: "input" | "select" | "textarea"
//  - options: string[] (for as="select")
//  - required: bool (shows a red asterisk, purely visual)
// ==========================================================

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  as = "input",
  options = [],
  required = false,
  disabled = false,
}) {
  return (
    <div className={`input-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      {as === "select" ? (
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={type === "password" ? "current-password" : "off"}
        />
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default InputField;
