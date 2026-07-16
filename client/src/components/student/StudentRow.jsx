import { useNavigate } from "react-router-dom";
import StudentActions from "./StudentActions";

// ==========================================================
// StudentRow
// One <tr> in the students table. Clicking the row (outside
// the action buttons) opens the student's profile page.
// ==========================================================

const STATUS_BADGE = {
  Active: "badge-active",
  Inactive: "badge-inactive",
  Left: "badge-left",
};

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";
}

function StudentRow({ student, onDelete }) {
  const navigate = useNavigate();

  return (
    <tr className="student-row" onClick={() => navigate(`/students/${student.id}`)}>
      <td>
        <div className="student-cell-user">
          <div className="student-avatar">{initials(student.full_name)}</div>
          <div>
            <div className="student-cell-title">{student.full_name}</div>
            <div className="student-cell-sub">{student.email}</div>
          </div>
        </div>
      </td>

      <td>
        <div className="student-cell-title">{student.phone}</div>
        <div className="student-cell-sub">{student.city}, {student.state}</div>
      </td>

      <td>
        <div className="student-cell-title">{student.course}</div>
        <div className="student-cell-sub">
          {student.college_name} · Sem {student.semester}
        </div>
      </td>

      <td>
        <div className="student-cell-title">{student.guardian_name}</div>
        <div className="student-cell-sub">{student.guardian_phone}</div>
      </td>

      <td>
        <span className={`student-badge ${STATUS_BADGE[student.status] || ""}`}>
          {student.status}
        </span>
      </td>

      <td>
        <StudentActions student={student} onDelete={onDelete} />
      </td>
    </tr>
  );
}

export default StudentRow;
