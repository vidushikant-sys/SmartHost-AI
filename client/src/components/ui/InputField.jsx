function InputField({
  label,
  as = "input",
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  options = [],
  error = "",
  required = false,
  disabled = false,
  readOnly = false,
}) {
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
          value={value || ""}
          onChange={onChange}
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
          value={value || ""}
          onChange={onChange}
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
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={error ? "input-error" : ""}
        />
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default InputField;