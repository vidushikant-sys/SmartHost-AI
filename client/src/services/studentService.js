import { request } from "./apiClient";

// ==========================================================
// studentService
// Talks to GET/POST/PUT/DELETE /api/student/* on the backend.
// ==========================================================

export function getAllStudents() {
  return request("/student/all");
}

export function getStudentById(id) {
  return request(`/student/${id}`);
}

export function createStudent(payload) {
  return request("/student/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStudent(id, payload) {
  return request(`/student/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteStudent(id) {
  return request(`/student/delete/${id}`, {
    method: "DELETE",
  });
}
