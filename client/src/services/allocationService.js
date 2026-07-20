import { request } from "./apiClient";

// ==========================================================
// allocationService
// Talks to /api/allocation/* on the backend — the module that
// links a Student to a Room (server/models/room_allocation.py).
// ==========================================================

/** POST /allocation/allocate — { student_id, room_id, allocated_date, remarks? } */
export function allocateRoom(payload) {
  return request("/allocation/allocate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /allocation/all */
export function getAllAllocations() {
  return request("/allocation/all");
}

/** GET /allocation/student/:studentId — 404 (no active allocation) is normal, not an error */
export function getStudentAllocation(studentId) {
  return request(`/allocation/student/${studentId}`).catch((err) => {
    if (err.status === 404) return null;
    throw err;
  });
}

/** GET /allocation/room/:roomId — current occupants of a room */
export function getRoomAllocations(roomId) {
  return request(`/allocation/room/${roomId}`);
}

/** PUT /allocation/transfer/:studentId — { room_id, allocated_date, remarks? } */
export function transferRoom(studentId, payload) {
  return request(`/allocation/transfer/${studentId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** PUT /allocation/vacate/:studentId — { vacated_date, remarks? } */
export function vacateRoom(studentId, payload) {
  return request(`/allocation/vacate/${studentId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
