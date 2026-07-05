function Button({
  text,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`primary-btn ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;