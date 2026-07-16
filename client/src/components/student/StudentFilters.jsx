// ==========================================================
// StudentFilters
// Search + status filter bar for StudentList.
// Fully controlled — parent owns the state.
// ==========================================================

function StudentFilters({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="student-filters">
      <div className="student-search">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="student-status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Left">Left</option>
      </select>
    </div>
  );
}

export default StudentFilters;
