import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBed,
  FaUserGraduate,
} from "react-icons/fa";

function StudentTable({
  students = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
    

  if (loading) {
    return (
      <div className="student-table-card">

        <div className="table-loading">
          Loading students...
        </div>

      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="student-table-card">

        <div className="table-empty">

          <FaUserGraduate className="empty-icon" />

          <h3>No Students Found</h3>

          <p>
            Click Add Student to create your first record.
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="student-table-card">

      <div className="student-table-header">

        <div>
          <h3>Students List</h3>
          <p>
            Showing {students.length} Students
          </p>
        </div>

      </div>

      <div className="table-responsive">

        <table className="student-table">

          <thead>

            <tr>

              <th>Photo</th>

              <th>Student</th>

              <th>Course</th>

              <th>Year</th>

              <th>Room</th>

              <th>Phone</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

        {
          students.length === 0 ? (

            <tr>

              <td
                colSpan="8"
                className="no-data"
              >
                No Students Found
              </td>

            </tr>

          ) : (

            students.map((student) => (

              <tr key={student.id}>

                <td>

                  <img
                    src={
                      student.profile_photo ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(student.full_name)
                    }
                    alt={student.full_name}
                    className="student-avatar"
                  />

                </td>

                <td>

                  <div className="student-info">

                    <strong>
                      {student.full_name}
                    </strong>

                    <span>
                      #{student.registration_number}
                    </span>

                  </div>

                </td>

                <td>

                  {student.course}

                </td>

                <td>

                  {student.year}

                </td>

                <td>

                  {
                    student.room_number
                      ? student.room_number
                      : "--"
                  }

                </td>

                <td>

                  {student.phone}

                </td>
                {/* ========================= */}
{/* Status */}
{/* ========================= */}

<td>

    <span
        className={
            student.status === "Active"
                ? "status-badge active"
                : "status-badge inactive"
        }
    >
        {student.status}
    </span>

</td>

{/* ========================= */}
{/* Actions */}
{/* ========================= */}

<td>

    <div className="student-actions">

        <button

            className="action-btn view-btn"

            title="View Student"

            onClick={() => onView(student)}

        >

            <FaEye />

        </button>

        <button

            className="action-btn edit-btn"

            title="Edit Student"

            onClick={() => onEdit(student)}

        >

            <FaEdit />

        </button>

        <button

            className="action-btn delete-btn"

            title="Delete Student"

            onClick={() => onDelete(student)}

        >

            <FaTrash />

        </button>

    </div>

</td>

</tr>

))

)

}

</tbody>

</table>

</div>

</div>

);

}

export default StudentTable;