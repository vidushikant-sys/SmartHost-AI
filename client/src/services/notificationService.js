import { request } from "./apiClient";

// ==========================================================
// notificationService
// Talks to /api/notification/* on the backend
// (server/routes/notification.py, blueprint url_prefix="/api/notification").
// ==========================================================

/** POST /notification/add */
export function createNotification(payload) {
  return request("/notification/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /notification/all — every notification, across all students */
export function getAllNotifications() {
  return request("/notification/all");
}

/** GET /notification/:id */
export function getNotificationById(id) {
  return request(`/notification/${id}`);
}

/** GET /notification/student/:studentId */
export function getStudentNotifications(studentId) {
  return request(`/notification/student/${studentId}`);
}

/** PUT /notification/read/:id */
export function markNotificationAsRead(id) {
  return request(`/notification/read/${id}`, {
    method: "PUT",
  });
}

/** PUT /notification/read-all/:studentId — marks all of ONE student's notifications read */
export function markAllAsReadForStudent(studentId) {
  return request(`/notification/read-all/${studentId}`, {
    method: "PUT",
  });
}

/** DELETE /notification/delete/:id */
export function deleteNotification(id) {
  return request(`/notification/delete/${id}`, {
    method: "DELETE",
  });
}

/** GET /notification/unread-count/:studentId */
export function getUnreadCountForStudent(studentId) {
  return request(`/notification/unread-count/${studentId}`);
}

/** GET /notification/stats — counts by read state and by type, across all students */
export function getNotificationStats() {
  return request("/notification/stats");
}
