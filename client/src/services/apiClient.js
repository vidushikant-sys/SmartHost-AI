// ==========================================================
// apiClient
// Single shared request() helper used by every service file
// (auth, hostel, dashboard, student, room, fee, ...).
//
// IMPORTANT: this file no longer talks to the network directly.
// It's a thin wrapper around the existing axios instance in
// "./api" — the one that already attaches the JWT token and
// already redirects to "/" on a 401. This file exists purely so
// that service files (authService.js, hostelService.js, etc.)
// don't need to change: they still call `request(endpoint, ...)`
// exactly as before, they just get axios + auto-logout underneath
// now instead of raw fetch.
//
// Do NOT delete "./api" — it's still the one real HTTP client.
// This file just re-exposes it under the old request() shape.
// ==========================================================

import api from "./api";

// Kept for any code that still imports these directly (e.g. image URLs).
export const API_BASE = api.defaults.baseURL;

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

/**
 * Same call signature every existing service file already uses:
 *   request("/property/all")
 *   request("/property/add", { method: "POST", body: JSON.stringify(data) })
 *
 * `body` is accepted as a JSON string (like plain fetch expected) so no
 * caller needs to change — it's parsed back into an object for axios here.
 */
export async function request(endpoint, options = {}) {
  const { method = "GET", body, headers } = options;

  let data;
  if (body !== undefined) {
    data = typeof body === "string" ? JSON.parse(body) : body;
  }

  try {
    const response = await api.request({
      url: endpoint,
      method,
      data,
      headers,
    });

    const payload = response.data;

    if (payload && payload.success === false) {
      const err = new Error(payload.message || "Request failed");
      err.status = response.status;
      err.errors = payload.errors || null;
      throw err;
    }

    return payload?.data ?? payload;
  } catch (error) {
    // Already one of our normalized errors (thrown above) — rethrow as is.
    if (error.status !== undefined && !error.response) {
      throw error;
    }

    // Axios error with a server response (4xx/5xx)
    if (error.response) {
      const payload = error.response.data || {};
      const err = new Error(payload.message || `Request failed (${error.response.status})`);
      err.status = error.response.status;
      err.errors = payload.errors || null;
      throw err;
    }

    // Network error / no response at all (server down, CORS, offline, etc.)
    const err = new Error(
      "Could not reach the server. Please check your connection and try again."
    );
    err.status = 0;
    throw err;
  }
}
