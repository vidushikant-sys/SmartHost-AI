// ==========================================================
// apiClient
// Single shared fetch wrapper used by every service file
// (auth, dashboard, student, room, fee, ...). Handles the
// JWT auth header, base URL, and consistent error shape.
// ==========================================================

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Server origin without the trailing "/api" — used to build absolute URLs
// for static assets served outside the API (e.g. /uploads/students/xyz.jpg).
export const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

// Resolves a relative file path returned by the backend (e.g.
// "/uploads/students/xyz.jpg") into a full, browser-loadable URL.
// Returns null if no path is given, so callers can fall back to a
// placeholder/initials avatar.
export function resolveFileUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SERVER_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. 204 No Content)
  }

  if (!res.ok || (body && body.success === false)) {
    const message = body?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.errors = body?.errors || null; // field-level validation errors from Flask
    throw err;
  }

  return body?.data ?? body;
}
