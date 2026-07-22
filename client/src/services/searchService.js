import { request } from "./apiClient";

// ==========================================================
// searchService
// Talks to /api/search/* on the backend
// (server/routes/search.py, blueprint url_prefix="/api/search").
//
// IMPORTANT: each backend filter is an independent, separately-
// ANDed field (e.g. search_students ANDs name + email + phone
// together if you send them all at once). For a single free-text
// box we must send ONE field per request and merge results
// client-side, or the filters cancel each other out.
// ==========================================================

function toQuery(params) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return q;
}

/** GET /search/students?name= (or ?phone= / ?email=) */
export function searchStudentsByName(name) {
  return request(`/search/students?${toQuery({ name })}`);
}

export function searchStudentsByPhone(phone) {
  return request(`/search/students?${toQuery({ phone })}`);
}

/** GET /search/rooms?room_number= */
export function searchRoomsByNumber(roomNumber) {
  return request(`/search/rooms?${toQuery({ room_number: roomNumber })}`);
}

/** GET /search/rooms?room_type= (also tried against sharing_type) */
export function searchRoomsByType(roomType) {
  return request(`/search/rooms?${toQuery({ room_type: roomType })}`);
}

export function searchRoomsBySharing(sharingType) {
  return request(`/search/rooms?${toQuery({ sharing_type: sharingType })}`);
}

/** GET /search/hostels?title= */
export function searchHostelsByTitle(title) {
  return request(`/search/hostels?${toQuery({ title })}`);
}

/** GET /search/complaints?title= (also tried against student_name) */
export function searchComplaintsByTitle(title) {
  return request(`/search/complaints?${toQuery({ title })}`);
}

export function searchComplaintsByStudentName(studentName) {
  return request(`/search/complaints?${toQuery({ student_name: studentName })}`);
}
