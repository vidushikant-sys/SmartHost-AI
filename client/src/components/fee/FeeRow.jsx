import { useNavigate } from "react-router-dom";
import FeeActions from "./FeeActions";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_BADGE = {
  Paid: "badge-active",
  Partial: "badge-inactive",
  Pending: "badge-left",
};

function FeeRow({ fee, onRecordPayment, onDelete }) {
  const navigate = useNavigate();

  const overdue =
    fee.payment_status !== "Paid" && new Date(fee.due_date) < new Date();

  return (
    <tr className="room-row" onClick={() => navigate(`/fees/${fee.id}`)}>
      <td>
        <div className="room-cell-title">{fee.student_name}</div>
        <div className="room-cell-sub">{fee.hostel_name}</div>
      </td>

      <td>
        <div className="room-cell-title">{fee.room_number}</div>
      </td>

      <td>
        <div className="room-cell-title">
          {MONTHS[fee.month - 1]} {fee.year}
        </div>
        <div className={`room-cell-sub ${overdue ? "fee-overdue-text" : ""}`}>
          Due {new Date(fee.due_date).toLocaleDateString("en-IN")}
          {overdue && " · Overdue"}
        </div>
      </td>

      <td>
        <div className="room-cell-title">
          ₹{Number(fee.total_amount).toLocaleString("en-IN")}
        </div>
        <div className="room-cell-sub">
          ₹{Number(fee.remaining_amount).toLocaleString("en-IN")} due
        </div>
      </td>

      <td>
        <span className={`room-badge ${STATUS_BADGE[fee.payment_status] || ""}`}>
          {fee.payment_status}
        </span>
      </td>

      <td>
        <FeeActions fee={fee} onRecordPayment={onRecordPayment} onDelete={onDelete} />
      </td>
    </tr>
  );
}

export default FeeRow;
