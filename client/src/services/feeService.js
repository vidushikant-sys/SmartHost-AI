import { request } from "./apiClient";

// ==========================================================
// feeService
// Talks to /api/fees/* and /api/payments/* on the backend
// (server/routes/fee.py, blueprint url_prefix="/api").
// ==========================================================

function withHostelParam(endpoint, hostelId) {
  return hostelId ? `${endpoint}?hostel_id=${hostelId}` : endpoint;
}

// ---------------------------------------------------------
// Fee CRUD
// ---------------------------------------------------------

/** POST /fees */
export function createFee(payload) {
  return request("/fees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /fees?hostel_id= */
export function getAllFees(hostelId) {
  return request(withHostelParam("/fees", hostelId));
}

/** GET /fees/:id */
export function getFeeById(id) {
  return request(`/fees/${id}`);
}

/** PUT /fees/:id — only charge fields + due_date + remarks are editable */
export function updateFee(id, payload) {
  return request(`/fees/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /fees/:id */
export function deleteFee(id) {
  return request(`/fees/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------
// Lookups
// ---------------------------------------------------------

/** GET /fees/student/:studentId — full fee history for one student */
export function getStudentFeeHistory(studentId) {
  return request(`/fees/student/${studentId}`);
}

/** GET /fees/student/:studentId/:month/:year — duplicate check before creating */
export function getStudentMonthFee(studentId, month, year) {
  return request(`/fees/student/${studentId}/${month}/${year}`).catch((err) => {
    if (err.status === 404) return null;
    throw err;
  });
}

/** GET /fees/pending */
export function getPendingFees(hostelId) {
  return request(withHostelParam("/fees/pending", hostelId));
}

/** GET /fees/overdue */
export function getOverdueFees(hostelId) {
  return request(withHostelParam("/fees/overdue", hostelId));
}

// ---------------------------------------------------------
// Payments
// ---------------------------------------------------------

/** POST /fees/:id/pay — the convenience "record a payment" endpoint */
export function payFee(feeId, payload) {
  return request(`/fees/${feeId}/pay`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /payments/history/:feeId — payment timeline for one fee */
export async function getPaymentHistory(feeId) {
  const res = await request(`/payments/history/${feeId}`);
  return res?.payments || [];
}

/** DELETE /payments/:paymentId — undo a mistaken payment entry */
export function deletePayment(paymentId) {
  return request(`/payments/${paymentId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------
// Dashboard / Reports
// ---------------------------------------------------------

/** GET /fees/dashboard?hostel_id= */
export function getFeeDashboard(hostelId) {
  return request(withHostelParam("/fees/dashboard", hostelId));
}

/** GET /fees/monthly-collection/:month/:year */
export function getMonthlyCollection(month, year) {
  return request(`/fees/monthly-collection/${month}/${year}`);
}
