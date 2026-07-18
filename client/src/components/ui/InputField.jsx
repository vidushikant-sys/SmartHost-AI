function InputField({
  label,
  as = "input",
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder = "",
  options = [],
  error = "",
  helperText = "",
  required = false,
  disabled = false,
  readOnly = false,
}) {
  // IMPORTANT: use `?? ""` (nullish coalescing), not `|| ""`.
  // `|| ""` treats the number 0 as falsy and blanks the field —
  // which breaks things like "Available Beds: 0" or "Floor: 0"
  // (ground floor). `??` only falls back on null/undefined.
  const displayValue = value ?? "";

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      {as === "select" ? (
        <select
          id={name}
          name={name}
          value={displayValue}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={error ? "input-error" : ""}
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={displayValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={error ? "input-error" : ""}
          rows={4}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={displayValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={error ? "input-error" : ""}
        />
      )}

      {helperText && !error && (
        <span className="field-helper">{helperText}</span>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default InputField;
