export default function SocialButton({ icon, text }) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/60 hover:shadow-md active:translate-y-0"
    >
      <span className="flex shrink-0 items-center justify-center leading-none">
        {icon}
      </span>
      <span>{text}</span>
    </button>
  );
}