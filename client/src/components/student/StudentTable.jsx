import StudentRow from "./StudentRow";

// ==========================================================
// StudentTable
// Renders the table header + one StudentRow per student.
// Handles its own loading skeleton / empty state.
// ==========================================================

function StudentTable({ students, loading, onDelete }) {
  if (loading) {
    return (
      <div className="student-table-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="student-skeleton-row" />
        ))}
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="student-table-wrap">
        <div className="student-empty-state">
          <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>No students found. Try adjusting your search or add a new student.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-table-wrap">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Contact</th>
            <th>Course</th>
            <th>Guardian</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <StudentRow key={s.id} student={s} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
