import { useNavigate } from "react-router-dom";

function FeeActions({ fee, onRecordPayment, onDelete }) {
  const navigate = useNavigate();
  const isPaid = fee.payment_status === "Paid";

  return (
    <div className="room-row-actions" onClick={(e) => e.stopPropagation()}>
      <button
        className="room-icon-btn"
        title="View Fee"
        onClick={() => navigate(`/fees/${fee.id}`)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>

      {!isPaid && (
        <button
          className="room-icon-btn fee-pay-btn"
          title="Record Payment"
          onClick={() => onRecordPayment(fee)}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M6 3h12" />
              <path d="M6 8h12" />
              <path d="M6 13h3" />
              <path d="M9 13c6.667 0 6.667-10 0-10" />
              <path d="m6 13 8.5 8" />
            </g>
          </svg>
        </button>
      )}

      <button
        className="room-icon-btn danger"
        title="Delete Fee"
        onClick={() => onDelete(fee)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default FeeActions;
