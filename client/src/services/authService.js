import { request } from "./apiClient";

// ==========================================================
// authService
// Talks to GET/POST /api/auth/* on the Flask backend.
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
