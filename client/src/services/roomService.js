import { request } from "./apiClient";

// ==========================================================
// roomService
// Talks to GET/POST/PUT/DELETE /api/room/* on the backend.
// Mirrors studentService.js exactly (same apiClient, same
// throw-with-.errors contract used by RoomForm).
// ==========================================================

export function getAllRooms() {
  return request("/room/all");
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

// ==========================================================
// getAllHostels
// Rooms only store a `hostel_id` (FK) — the backend room
// endpoints don't embed the hostel's name. To show "Hostel
// Name" on the Room List / Details / Form (dropdown), we
// fetch the real hostel list from the already-existing
// Property module (/api/property/all) and map id -> title
// on the client. This is real backend data, not a mock.
// ==========================================================
export function getAllHostels() {
  return request("/property/all");
}
