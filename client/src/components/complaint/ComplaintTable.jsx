import ComplaintRow from "./ComplaintRow";

function ComplaintTable({ complaints, loading, onRespond, onDelete }) {
  if (loading) {
    return (
      <div className="room-table-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="room-skeleton-row" />
        ))}
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="room-table-wrap">
        <div className="room-empty-state">
          <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>No complaints found. All quiet for now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-table-wrap">
      <table className="room-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Complaint</th>
            <th>Priority</th>
            <th>Filed On</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <ComplaintRow
              key={c.id}
              complaint={c}
              onRespond={onRespond}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;
