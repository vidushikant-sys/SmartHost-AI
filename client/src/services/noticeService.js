import { request } from "./apiClient";

// ==========================================================
// noticeService
// Talks to /api/notice/* on the backend
// (server/routes/notice.py, blueprint url_prefix="/api/notice").
// ==========================================================

function withHostelParam(endpoint, hostelId) {
  return hostelId ? `${endpoint}?hostel_id=${hostelId}` : endpoint;
}

/** POST /notice/add */
export function createNotice(payload) {
  return request("/notice/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /notice/all?hostel_id= — hostel-specific notices + global ones */
export function getAllNotices(hostelId) {
  return request(withHostelParam("/notice/all", hostelId));
}

/** GET /notice/:id */
export function getNoticeById(id) {
  return request(`/notice/${id}`);
}

/** PUT /notice/update/:id */
export function updateNotice(id, payload) {
  return request(`/notice/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /notice/delete/:id */
export function deleteNotice(id) {
  return request(`/notice/delete/${id}`, {
    method: "DELETE",
  });
}

/** GET /notice/stats?hostel_id= */
export function getNoticeStats(hostelId) {
  return request(withHostelParam("/notice/stats", hostelId));
}
