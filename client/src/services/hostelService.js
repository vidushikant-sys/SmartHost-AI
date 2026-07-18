/**
 * hostelService.js
 * ---------------------------------------------------------------------------
 * API layer for the Hostel module. Uses the project's existing shared
 * `request()` helper from `./apiClient` — the same one `authService.js`
 * uses — so auth headers, base URL, and error shape all stay consistent
 * with the rest of the app. Nothing new to configure here.
 *
 * Matches the backend exactly:
 *   Model     : server/models/hostel.py         (SQLAlchemy model "Property")
 *   Routes    : server/routes/hostel.py          (blueprint: property_bp,
 *               registered with url_prefix="/api/property")
 *   Service   : server/services/hostel_service.py
 *   Validator : server/validators/hostel_validator.py
 *
 * NOTE ON NAMING:
 * The backend model/blueprint are internally called "Property" (a naming
 * slip on the backend, per the project owner), but every field, endpoint
 * and response is 100% about hostels. This file — and everything above it
 * in the UI — uses "hostel" naming throughout, and only talks to the
 * backend's real "/property" routes under the hood. Nothing in the UI
 * should ever say "property".
 *
 * ENDPOINTS (relative to apiClient's API_BASE, which already ends in "/api"):
 *   POST   /property/add          -> create hostel        (JWT required)
 *   GET    /property/all          -> list all hostels      (public)
 *   GET    /property/:id          -> get single hostel     (public)
 *   PUT    /property/update/:id   -> update hostel         (JWT required, owner only)
 *   DELETE /property/delete/:id   -> delete hostel         (JWT required, owner only)
 *
 * RESPONSE SHAPE (from utils/response.py -> success_response / error_response),
 * already unwrapped by apiClient's `request()`:
 *   success -> resolves with the `data` payload directly
 *   error   -> throws Error with { message, status, errors }
 * ---------------------------------------------------------------------------
 */

import { request } from "./apiClient";

const RESOURCE = "/property";

/** Enum kept in sync with hostel_validator.py's `valid_types` list. */
export const HOSTEL_TYPES = ["Boys Hostel", "Girls Hostel", "PG", "Apartment"];

/** GET /property/all — public, returns an array of hostels. */
export function getAllHostels() {
  return request(`${RESOURCE}/all`);
}

/** GET /property/:id — public, returns a single hostel. */
export function getHostelById(id) {
  return request(`${RESOURCE}/${id}`);
}

/**
 * POST /property/add — requires auth (handled automatically by apiClient).
 * Returns { hostel_id } on success, as sent by the backend.
 */
export function createHostel(data) {
  return request(`${RESOURCE}/add`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** PUT /property/update/:id — requires auth, owner only. Returns the updated hostel. */
export function updateHostel(id, data) {
  return request(`${RESOURCE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** DELETE /property/delete/:id — requires auth, owner only. */
export function deleteHostel(id) {
  return request(`${RESOURCE}/delete/${id}`, {
    method: "DELETE",
  });
}

const hostelService = {
  HOSTEL_TYPES,
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
};

export default hostelService;
