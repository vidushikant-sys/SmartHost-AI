import { useNavigate } from "react-router-dom";
import ComplaintActions from "./ComplaintActions";

const STATUS_BADGE = {
  Open: "badge-left",
  "In Progress": "badge-inactive",
  Resolved: "badge-active",
};

const PRIORITY_DOT = {
  Emergency: "#DC2626",
  High: "#F97316",
  Medium: "#EAB308",
  Low: "#94A3B8",
};

function ComplaintRow({ complaint, onRespond, onDelete }) {
  const navigate = useNavigate();

  return (
    <tr className="room-row" onClick={() => navigate(`/complaints/${complaint.id}`)}>
      <td>
        <div className="room-cell-title">{complaint.student_name}</div>
        <div className="room-cell-sub">
          {complaint.hostel_name || "—"} · {complaint.room_number || "—"}
        </div>
      </td>

      <td style={{ maxWidth: 260 }}>
        <div className="room-cell-title complaint-title-cell">{complaint.title}</div>
        <div className="room-cell-sub">{complaint.category}</div>
      </td>

      <td>
        <div className="complaint-priority-cell">
          <span
            className="complaint-priority-dot"
            style={{ background: PRIORITY_DOT[complaint.priority] }}
          />
          {complaint.priority}
        </div>
      </td>

      <td>
        <div className="room-cell-sub">
          {new Date(complaint.created_at).toLocaleDateString("en-IN")}
        </div>
      </td>

      <td>
        <span className={`room-badge ${STATUS_BADGE[complaint.status] || ""}`}>
          {complaint.status}
        </span>
      </td>

      <td>
        <ComplaintActions complaint={complaint} onRespond={onRespond} onDelete={onDelete} />
      </td>
    </tr>
  );
}

export default ComplaintRow;
