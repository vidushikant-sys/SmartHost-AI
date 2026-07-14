export default function SidebarItem({
  icon,
  title,
  active = false,
}) {
  return (
    <button
      className={`group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300
      ${
        active
          ? "bg-indigo-600 text-white shadow-lg"
          : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
      }`}
    >
      <span className="text-xl">{icon}</span>

      <span className="font-medium">
        {title}
      </span>
    </button>
  );
}