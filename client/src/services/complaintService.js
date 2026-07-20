import { request } from "./apiClient";

// ==========================================================
// complaintService
// Talks to /api/complaint/* on the backend
// (server/routes/complaint.py, blueprint url_prefix="/api/complaint").
// ==========================================================

function withHostelParam(endpoint, hostelId) {
  return hostelId ? `${endpoint}?hostel_id=${hostelId}` : endpoint;
}

/** POST /complaint/add */
export function createComplaint(payload) {
  return request("/complaint/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /complaint/all?hostel_id= */
export function getAllComplaints(hostelId) {
  return request(withHostelParam("/complaint/all", hostelId));
}

/** GET /complaint/:id */
export function getComplaintById(id) {
  return request(`/complaint/${id}`);
}

/** GET /complaint/student/:studentId */
export function getStudentComplaints(studentId) {
  return request(`/complaint/student/${studentId}`);
}

/** PUT /complaint/update/:id — admin updates status/priority/category/admin_reply */
export function updateComplaint(id, payload) {
  return request(`/complaint/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /complaint/delete/:id */
export function deleteComplaint(id) {
  return request(`/complaint/delete/${id}`, {
    method: "DELETE",
  });
}

/** GET /complaint/stats?hostel_id= */
export function getComplaintStats(hostelId) {
  return request(withHostelParam("/complaint/stats", hostelId));
}
