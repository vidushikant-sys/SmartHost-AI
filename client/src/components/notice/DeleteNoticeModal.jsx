function DeleteNoticeModal({ notice, onConfirm, onCancel, deleting }) {
  if (!notice) return null;

  return (
    <div className="room-modal-overlay" onClick={onCancel}>
      <div className="room-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="room-modal-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h3>Delete Notice</h3>
        <p>
          Delete "<strong>{notice.title}</strong>"? This can't be undone.
        </p>

        <div className="room-modal-actions">
          <button className="room-btn-secondary" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="room-btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteNoticeModal;
