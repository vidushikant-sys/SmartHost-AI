import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/Logo.png";
import InputField from "./InputField";
import SocialButton from "./SocialButton";
import { login } from "../../services/authService";
import { saveToken } from "../../utils/token";

// Official brand marks — kept as inline SVGs so the real Google / Microsoft
// colors render instead of generic monochrome icons.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-[19px] w-[19px]">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
        l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24
        C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 21 21" className="h-[18px] w-[18px]">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-400">
      <path
        d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({
        email: form.email.trim(),
        password: form.password,
      });
      const token = res?.token || res?.access_token;
      if (!token) {
        throw new Error("Login response did not include a token.");
      }
      saveToken(token);
      localStorage.setItem("admin", JSON.stringify(res.admin || {}));
      navigate("/dashboard");
    } catch (error) {
      const message = error?.message || "Login Failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_25px_70px_-15px_rgba(30,41,90,0.25)]">
      {/* Signature accent ribbon — the one bold move, everything else stays quiet */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-400" />

      <div className="px-11 py-7 sm:px-12 sm:py-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="ViNova" className="h-28 object-contain sm:h-32" />
        </div>

        {/* Heading */}
        <div className="-mt-2 text-center">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[28px]">
            Welcome Back!
          </h1>
          <p className="mt-1.5 text-[14px] text-slate-500">
            Sign in to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <InputField
            label="Username or Email"
            placeholder="Enter your username or email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between pt-0.5 text-sm">
            <label className="flex cursor-pointer items-center gap-2.5 text-slate-600">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded accent-indigo-600"
              />
              Remember me
            </label>

            <button
              type="button"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/35 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{loading ? "Signing In..." : "Sign In"}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[13px] text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Social */}
        <div className="space-y-3">
          <SocialButton icon={<GoogleIcon />} text="Continue with Google" />
          <SocialButton icon={<MicrosoftIcon />} text="Continue with Microsoft" />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[13px] text-slate-500">
          <ShieldIcon />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}