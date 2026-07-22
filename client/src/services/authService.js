import { request, API_BASE } from "./apiClient";

// ==========================================================
// authService
// Talks to GET/POST/PUT /api/auth/* on the Flask backend.
// ==========================================================

export function login(emailOrPayload, password) {
  const payload =
    typeof emailOrPayload === "object" && emailOrPayload !== null
      ? emailOrPayload
      : { email: emailOrPayload, password };

  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginRequest(email, password) {
  return login(email, password);
}

export function registerRequest(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchProfile() {
  return request("/auth/profile");
}

// ---------------- Settings: Profile ----------------

export function updateProfile(payload) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ---------------- Settings: Security ----------------

export function changePassword(currentPassword, newPassword) {
  return request("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

// ---------------- Settings: Appearance + Notifications ----------------

export function getPreferences() {
  return request("/auth/preferences");
}

export function updatePreferences(payload) {
  return request("/auth/preferences", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ---------------- Settings: Avatar upload ----------------
// Uses fetch directly (like uploadStudentFile) since file uploads must
// NOT set a JSON Content-Type header.
export async function uploadAvatar(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload/admin`, {
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
