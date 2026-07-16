import { useNavigate } from "react-router-dom";
import StudentActions from "./StudentActions";
import { resolveFileUrl } from "../../services/apiClient";

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

const FEE_META = {
  Paid: { badge: "badge-active", dot: "🟢" },
  Partial: { badge: "badge-inactive", dot: "🟠" },
  Unpaid: { badge: "badge-left", dot: "🔴" },
  "Not Generated": { badge: "badge-inactive", dot: "⚪" },
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
          {student.profile_photo ? (
            <img
              src={resolveFileUrl(student.profile_photo)}
              alt={student.full_name}
              className="student-avatar student-avatar-img"
            />
          ) : (
            <div className="student-avatar">{initials(student.full_name)}</div>
          )}
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
        <div className="student-cell-title">{student.room_number || "Not Allocated"}</div>
        <div className="student-cell-sub">{student.hostel_name || "Not Assigned"}</div>
      </td>

      <td>
        <span className={`student-badge student-badge-dot ${FEE_META[student.fee_status]?.badge || "badge-inactive"}`}>
          <span aria-hidden="true">{FEE_META[student.fee_status]?.dot || "⚪"}</span>
          {student.fee_status || "—"}
        </span>
        {student.pending_amount > 0 && (
          <div className="student-cell-sub">Due ₹{Number(student.pending_amount).toLocaleString("en-IN")}</div>
        )}
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
