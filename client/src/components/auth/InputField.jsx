import { useState } from "react";
import { FaRegUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputField({ label, placeholder, type, name, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-800">
        {label}
      </label>

      <div
        className={`flex h-11 items-center gap-2.5 rounded-lg border bg-white px-3 transition-all duration-200 ${
          focused
            ? "border-indigo-500 ring-4 ring-indigo-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span
          className={`flex shrink-0 items-center text-sm transition-colors ${
            focused ? "text-indigo-500" : "text-slate-400"
          }`}
        >
          {isPassword ? <FaLock /> : <FaRegUser />}
        </span>

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex shrink-0 items-center justify-center p-0 text-[15px] leading-none text-slate-400 transition-colors hover:text-indigo-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}