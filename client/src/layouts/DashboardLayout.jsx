import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <div className="flex flex-col flex-1 overflow-hidden">

        <TopNavbar />

        <main className="flex-1 overflow-y-auto bg-slate-100 px-8 py-8">

          <div className="mx-auto max-w-[1700px]">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}