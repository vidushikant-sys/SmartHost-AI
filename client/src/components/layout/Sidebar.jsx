import logo from "../../assets/logo/Logo.png";
import {
  FaHouse,
  FaBuilding,
  FaBed,
  FaUserGraduate,
  FaMoneyBillWave,
  FaClipboardList,
  FaBullhorn,
  FaBell,
  FaChartLine,
  FaGear,
  FaRightFromBracket,
} from "react-icons/fa6";


const menu = [
  { title: "Dashboard", icon: FaHouse },
  { title: "Hostels", icon: FaBuilding },
  { title: "Rooms", icon: FaBed },
  { title: "Students", icon: FaUserGraduate },
  { title: "Fees", icon: FaMoneyBillWave },
  { title: "Complaints", icon: FaClipboardList },
  { title: "Notices", icon: FaBullhorn },
  { title: "Notifications", icon: FaBell },
  { title: "Reports", icon: FaChartLine },
  { title: "Settings", icon: FaGear },
];

export default function Sidebar() {
  return (
    <aside className="w-[280px] h-screen bg-white border-r border-slate-200 flex flex-col">

      {/* Logo */}
      {/* Logo */}
{/* Note: h-18 ko h-20 ya auto kiya hai taaki bada logo andar fit ho sake */}
<div className="h-20 flex items-center px-7 border-b border-slate-100"> 

  {/* Container aur Image dono ka size badakar w-14 h-14 (56px) kar diya hai */}
  <div className="w-26 h-20 flex items-center justify-center">
    <img
      src={logo}
      alt="ViNova Logo"
      className="w-20 h-20 object-contain"
    />
  </div>


        <div className="ml-4">
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">
            ViNova
          </h1>

          <p className="text-[15px] text-slate-500">
            Hostel Management
          </p>
        </div>

      </div>

      {/* Menu */}
      <div className="flex-1 py-6">

        {menu.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className={`w-full flex items-center gap-3 pl-12 pr-8 h-13 transition-all duration-200
                index === 0
                  ? "bg-indigo-50 border-r-4 border-indigo-600 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center overflow-visible">
  <Icon className="text-[20px]" />
</div>
              <span className="text-[15px] font-semibold">
                {item.title}
              </span>
            </button>
          );
        })}

      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-5">

        <button className="w-full h-12 rounded-xl flex items-center gap-3 px-5 text-red-500 hover:bg-red-50 transition">

          <FaRightFromBracket />

          <span className="font-semibold text-[15px]">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}