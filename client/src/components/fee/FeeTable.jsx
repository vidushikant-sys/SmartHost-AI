import FeeRow from "./FeeRow";

function FeeTable({ fees, loading, onRecordPayment, onDelete }) {
  if (loading) {
    return (
      <div className="room-table-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="room-skeleton-row" />
        ))}
      </div>
    );
  }

  if (!fees || fees.length === 0) {
    return (
      <div className="room-table-wrap">
        <div className="room-empty-state">
          <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>No fee records found. Generate a fee to get started.</p>
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
            <th>Room</th>
            <th>Period</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <FeeRow
              key={fee.id}
              fee={fee}
              onRecordPayment={onRecordPayment}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeeTable;
