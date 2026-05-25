import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "All Tasks",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 5h14M2 9h10M2 13h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/completed",
    label: "Completed",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.7" />
        <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: "/markets",
    label: "Polymarket",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14l4-5 3 3 3-4 4 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="4" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-3 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-sm font-bold text-gray-900 tracking-tight">TaskBoard</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-indigo-600" : "text-gray-400"}>{icon}</span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3">
        <p className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">v2.0</p>
      </div>
    </aside>
  );
}
