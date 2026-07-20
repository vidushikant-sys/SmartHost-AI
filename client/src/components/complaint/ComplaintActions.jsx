import { useNavigate } from "react-router-dom";

function ComplaintActions({ complaint, onRespond, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="room-row-actions" onClick={(e) => e.stopPropagation()}>
      <button
        className="room-icon-btn"
        title="View Complaint"
        onClick={() => navigate(`/complaints/${complaint.id}`)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>

      {complaint.status !== "Resolved" && (
        <button
          className="room-icon-btn fee-pay-btn"
          title="Respond"
          onClick={() => onRespond(complaint)}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <button
        className="room-icon-btn danger"
        title="Delete Complaint"
        onClick={() => onDelete(complaint)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default ComplaintActions;
