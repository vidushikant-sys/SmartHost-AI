import { request } from "./apiClient";

// ==========================================================
// Dashboard Service
// Handles all API calls for the Admin Dashboard.
// Talks directly to the Flask backend (JWT protected routes).
//
// Every function accepts an optional `hostelId`. When provided
// (from HostelContext), it's sent as ?hostel_id= so the backend
// scopes its numbers/lists to just that hostel. Pass null/undefined
// for the "All Hostels" view.
// ==========================================================

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function withHostelParam(endpoint, hostelId) {
  return hostelId ? `${endpoint}?hostel_id=${hostelId}` : endpoint;
}

// ----------------------------------------------------------
// Core dashboard stats -> GET /api/dashboard/
// { hostel, rooms, students, fees, complaints, notices }
// ----------------------------------------------------------
export function getDashboardStats(hostelId) {
  return request(withHostelParam("/dashboard/", hostelId));
}

// ----------------------------------------------------------
// Pending fees -> GET /api/fees/pending
// Used to power the "Upcoming Fees" widget
// ----------------------------------------------------------
export async function getUpcomingFees(limit = 5, hostelId) {
  const fees = await request(withHostelParam("/fees/pending", hostelId));
  return (fees || [])
    .slice()
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, limit);
}

// ----------------------------------------------------------
// Notices -> GET /api/notice/all
// Used to power the "Notice Board" widget
// ----------------------------------------------------------
export async function getRecentNotices(limit = 5, hostelId) {
  const notices = await request(withHostelParam("/notice/all", hostelId));
  return (notices || [])
    .filter((n) => n.status === "Active")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

// ----------------------------------------------------------
// Complaints -> GET /api/complaint/all
// Used to power the "Recent Activity" widget
// ----------------------------------------------------------
export async function getRecentComplaints(limit = 6, hostelId) {
  const complaints = await request(withHostelParam("/complaint/all", hostelId));
  return (complaints || [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

// ----------------------------------------------------------
// Revenue trend -> GET /api/fees/monthly-collection/:month/:year
// Fetches the last `count` months (oldest -> newest) in parallel
//
// Note: this endpoint doesn't yet support hostel-level filtering
// on the backend, so the revenue chart currently always reflects
// all hostels combined, even when a single hostel is selected.
// ----------------------------------------------------------
export async function getRevenueTrend(count = 6) {
  const now = new Date();
  const targets = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    targets.push({ month: d.getMonth() + 1, year: d.getFullYear() });
  }

  const results = await Promise.all(
    targets.map(({ month, year }) =>
      request(`/fees/monthly-collection/${month}/${year}`).catch(() => ({
        month,
        year,
        total_collection: 0,
      }))
    )
  );

  return results.map((r, i) => ({
    label: MONTH_LABELS[targets[i].month - 1],
    year: targets[i].year,
    total: Number(r.total_collection) || 0,
  }));
}

// ----------------------------------------------------------
// Combined loader for the whole dashboard page.
// Runs every widget's request in parallel; a single widget
// failing (e.g. an unfinished endpoint) won't break the rest.
//
// Pass the currently-selected hostelId (from useHostel()) so
// every widget scopes itself to that hostel — or omit/null it
// for the "All Hostels" view.
// ----------------------------------------------------------
export async function getDashboardOverview(hostelId) {
  const [stats, revenue, upcomingFees, notices, complaints] =
    await Promise.allSettled([
      getDashboardStats(hostelId),
      getRevenueTrend(6),
      getUpcomingFees(5, hostelId),
      getRecentNotices(5, hostelId),
      getRecentComplaints(6, hostelId),
    ]);

  const value = (r, fallback) =>
    r.status === "fulfilled" ? r.value : fallback;

  return {
    stats: value(stats, null),
    revenue: value(revenue, []),
    upcomingFees: value(upcomingFees, []),
    notices: value(notices, []),
    complaints: value(complaints, []),
    errors: [stats, revenue, upcomingFees, notices, complaints]
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason?.message),
  };
}
