import { request } from "./apiClient";

// ==========================================================
// reportService
// Talks to /api/reports/* on the backend
// (server/routes/reports.py, blueprint url_prefix="/api/reports").
// ==========================================================

function withParams(endpoint, params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return query ? `${endpoint}?${query}` : endpoint;
}

/** GET /reports/overview?hostel_id= */
export function getOverviewReport(hostelId) {
  return request(withParams("/reports/overview", { hostel_id: hostelId }));
}

/** GET /reports/revenue-trend?hostel_id=&months= */
export function getRevenueTrend(hostelId, months = 6) {
  return request(withParams("/reports/revenue-trend", { hostel_id: hostelId, months }));
}

/** GET /reports/student-growth?hostel_id=&months= */
export function getStudentGrowth(hostelId, months = 6) {
  return request(withParams("/reports/student-growth", { hostel_id: hostelId, months }));
}

/** GET /reports/hostel-performance (always all hostels — cross-hostel comparison) */
export function getHostelPerformance() {
  return request("/reports/hostel-performance");
}

/** GET /reports/complaint-insights?hostel_id= */
export function getComplaintInsights(hostelId) {
  return request(withParams("/reports/complaint-insights", { hostel_id: hostelId }));
}
