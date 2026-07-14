import { useEffect, useState } from "react";
import TopNavbar from "../../components/layout/TopNavbar";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import OccupancyCard from "../../components/dashboard/OccupancyCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import NoticeBoard from "../../components/dashboard/NoticeBoard";
import UpcomingFees from "../../components/dashboard/UpcomingFees";
import { getDashboardOverview } from "../../services/dashboardService";
import "../../styles/dashboard.css";

const ICONS = {
  students: (
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  rooms: (
    <path d="M3 22V12l9-6 9 6v10M9 22v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  revenue: (
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  complaints: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

function formatCurrency(n) {
  const num = Number(n || 0);
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let mounted = true;

    getDashboardOverview()
      .then((data) => {
        if (!mounted) return;
        setOverview(data);
        if (!data.stats) {
          setErrorMsg("Some dashboard data couldn't be loaded. Showing what's available.");
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setErrorMsg(err.message || "Failed to load dashboard.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const stats = overview?.stats;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="dashboard-shell">
      <TopNavbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back 👋</h1>
            <p className="subtitle">Here's what's happening across your hostels today.</p>
          </div>
          <div className="header-date">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {today}
          </div>
        </div>

        {errorMsg && !loading && (
          <div
            className="panel"
            style={{ marginBottom: 20, color: "#B45309", background: "#FFFBEB", borderColor: "#FDE68A" }}
          >
            {errorMsg}
          </div>
        )}

        <div className="stats-grid">
          <StatCard
            loading={loading}
            label="Total Students"
            value={stats?.students?.total_students ?? 0}
            icon={<svg viewBox="0 0 24 24">{ICONS.students}</svg>}
            color="blue"
            trend={
              stats
                ? { direction: "up", value: `${stats.students.active_students} active` }
                : null
            }
          />
          <StatCard
            loading={loading}
            label="Total Rooms"
            value={stats?.rooms?.total_rooms ?? 0}
            icon={<svg viewBox="0 0 24 24">{ICONS.rooms}</svg>}
            color="green"
            trend={
              stats
                ? { direction: "up", value: `${stats.rooms.available_rooms} free` }
                : null
            }
          />
          <StatCard
            loading={loading}
            label="Fee Collected"
            value={stats ? formatCurrency(stats.fees.total_collection) : "₹0"}
            icon={<svg viewBox="0 0 24 24">{ICONS.revenue}</svg>}
            color="amber"
            trend={
              stats
                ? { direction: "down", value: `${formatCurrency(stats.fees.pending_amount)} due` }
                : null
            }
          />
          <StatCard
            loading={loading}
            label="Open Complaints"
            value={stats?.complaints?.pending_complaints ?? 0}
            icon={<svg viewBox="0 0 24 24">{ICONS.complaints}</svg>}
            color="purple"
            trend={
              stats
                ? { direction: "up", value: `${stats.complaints.resolved_complaints} resolved` }
                : null
            }
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main-col">
            <RevenueChart data={overview?.revenue || []} loading={loading} />

            <div className="split-row">
              <RecentActivity complaints={overview?.complaints || []} loading={loading} />
              <UpcomingFees fees={overview?.upcomingFees || []} loading={loading} />
            </div>
          </div>

          <div className="dashboard-side-col">
            <OccupancyCard rooms={stats?.rooms} loading={loading} />
            <QuickActions />
            <NoticeBoard notices={overview?.notices || []} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
