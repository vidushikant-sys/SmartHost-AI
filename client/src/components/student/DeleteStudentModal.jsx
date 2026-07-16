// ==========================================================
// DeleteStudentModal
// Confirmation modal shown before permanently deleting a
// student record. Self-contained (styles live in student.css).
// ==========================================================

function DeleteStudentModal({ student, onConfirm, onCancel, deleting }) {
  if (!student) return null;

  return (
    <div className="student-modal-overlay" onClick={onCancel}>
      <div className="student-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h3>Delete Student</h3>
        <p>
          Are you sure you want to delete <strong>{student.full_name}</strong>?
          This will permanently remove their record, along with any linked
          fee and room history. This action cannot be undone.
        </p>

        <div className="student-modal-actions">
          <button className="student-btn-secondary" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="student-btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteStudentModal;
