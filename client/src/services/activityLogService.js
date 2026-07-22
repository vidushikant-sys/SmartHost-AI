import { request } from "./apiClient";

// ==========================================================
// activityLogService
// Talks to GET /api/activity/* on the Flask backend.
// ==========================================================

export function getAdminActivityLogs(adminId) {
  return request(`/activity/admin/${adminId}`);
}
