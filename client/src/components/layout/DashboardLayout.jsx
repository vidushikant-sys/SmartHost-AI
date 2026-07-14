import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "../../styles/dashboardLayout.css";

// ==========================================================
// DashboardLayout
// Common shell for every logged-in page: Sidebar (left) +
// TopNavbar (top) + page content. Wrap any page component
// with this instead of repeating the shell markup.
//
// Usage:
//   <DashboardLayout>
//     <YourPageContent />
//   </DashboardLayout>
// ==========================================================

const STORAGE_KEY = "sidebar_collapsed";

function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="app-main">
        <TopNavbar />
        <main className="app-page">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
