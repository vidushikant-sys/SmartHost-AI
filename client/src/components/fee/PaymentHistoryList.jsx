import { useState } from "react";
import { deletePayment } from "../../services/feeService";

const METHOD_ICON = {
  Cash: "💵",
  UPI: "📱",
  Card: "💳",
  "Bank Transfer": "🏦",
};

function PaymentHistoryList({ payments, onChanged }) {
  const list = Array.isArray(payments) ? payments : [];
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function handleDelete(payment) {
    if (!window.confirm(`Remove this ₹${payment.payment_amount} payment entry?`)) {
      return;
    }
    setDeletingId(payment.id);
    setError("");
    try {
      await deletePayment(payment.id);
      onChanged();
    } catch (err) {
      setError(err.message || "Failed to delete payment");
    } finally {
      setDeletingId(null);
    }
  }

  if (!list || list.length === 0) {
    return (
      <p className="room-profile-description">No payments recorded yet.</p>
    );
  }

  return (
    <div className="fee-payment-list">
      {error && <div className="room-form-error-banner">{error}</div>}
      {list.map((p) => (
        <div className="fee-payment-item" key={p.id}>
          <div className="fee-payment-icon">{METHOD_ICON[p.payment_method] || "🧾"}</div>
          <div className="fee-payment-info">
            <div className="fee-payment-amount">
              ₹{Number(p.payment_amount).toLocaleString("en-IN")}
              <span className="fee-payment-method"> · {p.payment_method}</span>
            </div>
            <div className="fee-payment-meta">
              {new Date(p.payment_date).toLocaleDateString("en-IN")}
              {p.received_by && ` · Received by ${p.received_by}`}
              {p.transaction_id && ` · Ref: ${p.transaction_id}`}
            </div>
            {p.remarks && <div className="fee-payment-remarks">{p.remarks}</div>}
          </div>
          <button
            className="room-icon-btn danger"
            title="Delete this payment"
            onClick={() => handleDelete(p)}
            disabled={deletingId === p.id}
          >
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default PaymentHistoryList;
