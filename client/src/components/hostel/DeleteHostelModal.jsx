/**
 * Confirmation modal shown before a destructive delete.
 * Parent controls visibility by only rendering this when `hostel` is set.
 */
export default function DeleteHostelModal({ hostel, onConfirm, onCancel, deleting }) {
  if (!hostel) return null;

  return (
    <div className="hostel-modal-overlay" role="dialog" aria-modal="true">
      <div className="hostel-modal">
        <div className="hostel-modal__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M9 7V4h6v3m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3>Delete this hostel?</h3>
        <p>
          You're about to permanently delete <strong>{hostel.title}</strong>. This
          can't be undone.
        </p>

        <div className="hostel-modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => onConfirm(hostel)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
