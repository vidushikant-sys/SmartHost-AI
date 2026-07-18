import HostelRow from "./HostelRow";

/**
 * Renders the hostel list as a table, plus loading / empty states.
 * Purely presentational — all data fetching/filtering happens in HostelList.
 */
export default function HostelTable({
  hostels,
  loading,
  onView,
  onEdit,
  onDeleteRequest,
}) {
  if (loading) {
    return (
      <div className="hostel-table__state">
        <div className="hostel-spinner" aria-hidden="true" />
        <p>Loading hostels…</p>
      </div>
    );
  }

  if (!hostels || hostels.length === 0) {
    return (
      <div className="hostel-table__state hostel-table__state--empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 21V9l9-6 9 6v12M3 21h18M9 21v-6h6v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <p>No hostels match these filters yet.</p>
        <span>Try adjusting your search, or add a new hostel to get started.</span>
      </div>
    );
  }

  return (
    <div className="hostel-table__wrapper">
      <table className="hostel-table">
        <thead>
          <tr>
            <th>Hostel</th>
            <th>Type</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Rooms</th>
            <th>Fee</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {hostels.map((hostel) => (
            <HostelRow
              key={hostel.id}
              hostel={hostel}
              onView={onView}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
