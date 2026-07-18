import { request } from "./apiClient";

// ==========================================================
// roomService
// Talks to GET/POST/PUT/DELETE /api/room/* on the backend.
// Mirrors studentService.js so the rest of the app stays
// consistent (same request() helper, same error shape with
// `.errors` for field-level validation failures).
// ==========================================================

export function getAllRooms(hostelId) {
  return request(hostelId ? `/room/all?hostel_id=${hostelId}` : "/room/all");
}

export function getRoomById(id) {
  return request(`/room/${id}`);
}

export function createRoom(payload) {
  return request("/room/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRoom(id, payload) {
  return request(`/room/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteRoom(id) {
  return request(`/room/delete/${id}`, {
    method: "DELETE",
  });
}
