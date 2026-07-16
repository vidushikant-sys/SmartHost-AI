import { useNavigate } from "react-router-dom";

// ==========================================================
// StudentActions
// View / Edit / Delete icon buttons for a single student row.
// ==========================================================

function StudentActions({ student, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="student-row-actions" onClick={(e) => e.stopPropagation()}>
      <button
        className="student-icon-btn"
        title="View Profile"
        onClick={() => navigate(`/students/${student.id}`)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>

      <button
        className="student-icon-btn"
        title="Edit Student"
        onClick={() => navigate(`/students/${student.id}/edit`)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        className="student-icon-btn danger"
        title="Delete Student"
        onClick={() => onDelete(student)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default StudentActions;
