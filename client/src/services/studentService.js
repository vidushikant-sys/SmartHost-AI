import { request, API_BASE } from "./apiClient";

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

// ==========================================================
// uploadStudentFile
// Uploads a profile photo / ID proof file to the generic
// /upload/student endpoint and returns the stored file path
// (e.g. "/uploads/students/<uuid>.jpg") to save on the student
// record. Uses fetch directly (not the shared `request` helper)
// because file uploads must NOT set a JSON Content-Type header —
// the browser needs to set the multipart/form-data boundary itself.
// ==========================================================
export async function uploadStudentFile(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload/student`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok || (body && body.success === false)) {
    const message = body?.message || `Upload failed (${res.status})`;
    throw new Error(message);
  }

  return body?.data?.image_url;
}
