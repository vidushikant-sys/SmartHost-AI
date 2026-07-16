import HostelActions from "./HostelActions";

function formatCurrency(value) {
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
}

/** Single row in the hostel table. */
export default function HostelRow({ hostel, onView, onEdit, onDeleteRequest }) {
  return (
    <tr className="hostel-row" data-type={hostel.hostel_type}>
      <td className="hostel-row__primary">
        <span className="hostel-row__type-dot" aria-hidden="true" />
        <div>
          <button
            type="button"
            className="hostel-row__title-btn"
            onClick={() => onView(hostel)}
          >
            {hostel.title}
          </button>
          <div className="hostel-row__subtitle">{hostel.address}</div>
        </div>
      </td>

      <td>
        <span className="hostel-badge" data-type={hostel.hostel_type}>
          {hostel.hostel_type}
        </span>
      </td>

      <td>
        {hostel.city}
        {hostel.state ? `, ${hostel.state}` : ""}
      </td>

      <td className="hostel-row__num">{hostel.total_capacity ?? "—"}</td>

      <td className="hostel-row__num">
        {hostel.bedrooms ?? 0} bed{Number(hostel.bedrooms) === 1 ? "" : "s"} ·{" "}
        {hostel.bathrooms ?? 0} bath{Number(hostel.bathrooms) === 1 ? "" : "s"}
      </td>

      <td className="hostel-row__num hostel-row__fee">
        {formatCurrency(hostel.monthly_fee)}
        <span className="hostel-row__fee-period">/mo</span>
      </td>

      <td>
        <HostelActions
          hostel={hostel}
          onView={onView}
          onEdit={onEdit}
          onDeleteRequest={onDeleteRequest}
        />
      </td>
    </tr>
  );
}
