import { useState } from "react";
import { payFee } from "../../services/feeService";
import "../../styles/fee.css";

// ==========================================================
// RecordPaymentModal
// Records a payment (full or partial) against a fee. Amount
// defaults to the full remaining balance but can be reduced
// for a partial payment.
// ==========================================================

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Bank Transfer"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function RecordPaymentModal({ fee, onClose, onSuccess }) {
  const [amount, setAmount] = useState(String(fee.remaining_amount));
  const [method, setMethod] = useState("Cash");
  const [date, setDate] = useState(todayISO());
  const [transactionId, setTransactionId] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [remarks, setRemarks] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const amountNum = Number(amount) || 0;
  const overpaying = amountNum > fee.remaining_amount;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (amountNum <= 0) {
      setSubmitError("Payment amount must be greater than zero.");
      return;
    }
    if (overpaying) {
      setSubmitError("Payment amount cannot exceed the remaining balance.");
      return;
    }

    setSubmitting(true);
    try {
      await payFee(fee.id, {
        payment_amount: amountNum,
        payment_method: method,
        payment_date: date,
        transaction_id: transactionId || undefined,
        received_by: receivedBy || undefined,
        remarks: remarks || undefined,
      });
      onSuccess();
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="room-modal-overlay" onClick={onClose}>
      <div
        className="room-modal-box allocation-modal-box fee-payment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Record Payment</h3>
        <p>
          {fee.student_name} · {fee.room_number} · Balance due:{" "}
          <strong>₹{Number(fee.remaining_amount).toLocaleString("en-IN")}</strong>
        </p>

        <form onSubmit={handleSubmit} className="allocation-form">
          {submitError && <div className="room-form-error-banner">{submitError}</div>}

          <div className="input-group">
            <label>
              Amount (₹)<span className="required">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              max={fee.remaining_amount}
              className={overpaying ? "input-error" : ""}
            />
            {overpaying && (
              <span className="field-error">
                Can't exceed the remaining balance (₹
                {Number(fee.remaining_amount).toLocaleString("en-IN")}).
              </span>
            )}
          </div>

          <div className="input-group">
            <label>
              Payment Method<span className="required">*</span>
            </label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>
              Payment Date<span className="required">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {(method === "UPI" || method === "Card" || method === "Bank Transfer") && (
            <div className="input-group">
              <label>Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Optional reference number"
              />
            </div>
          )}

          <div className="input-group">
            <label>Received By</label>
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="input-group">
            <label>Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional note..."
            />
          </div>

          <div className="room-modal-actions">
            <button
              type="button"
              className="room-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="room-btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordPaymentModal;
