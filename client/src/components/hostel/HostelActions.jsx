/**
 * Row-level action buttons: View, Edit, Delete.
 * Kept dependency-free (inline SVGs) so it drops into any project setup.
 */
export default function HostelActions({ hostel, onView, onEdit, onDeleteRequest }) {
  return (
    <div className="hostel-actions">
      <button
        type="button"
        className="hostel-actions__btn hostel-actions__btn--view"
        title="View hostel"
        aria-label={`View ${hostel.title}`}
        onClick={() => onView(hostel)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>

      <button
        type="button"
        className="hostel-actions__btn hostel-actions__btn--edit"
        title="Edit hostel"
        aria-label={`Edit ${hostel.title}`}
        onClick={() => onEdit(hostel)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className="hostel-actions__btn hostel-actions__btn--delete"
        title="Delete hostel"
        aria-label={`Delete ${hostel.title}`}
        onClick={() => onDeleteRequest(hostel)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h16M9 7V4h6v3m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
