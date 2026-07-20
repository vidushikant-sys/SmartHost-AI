import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RecordPaymentModal from "../../components/fee/RecordPaymentModal";
import DeleteFeeModal from "../../components/fee/DeleteFeeModal";
import PaymentHistoryList from "../../components/fee/PaymentHistoryList";
import { getFeeById, deleteFee, getPaymentHistory } from "../../services/feeService";
import "../../styles/room.css";
import "../../styles/fee.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_BADGE = {
  Paid: "badge-active",
  Partial: "badge-inactive",
  Pending: "badge-left",
};

function FeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fee, setFee] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function loadFee() {
    if (!/^\d+$/.test(String(id))) {
      setLoadError(
        `"${id}" isn't a valid fee ID — check the link that brought you here.`
      );
      setLoading(false);
      return Promise.resolve();
    }

    setLoading(true);
    return Promise.all([getFeeById(id), getPaymentHistory(id).catch(() => [])])
      .then(([feeData, paymentData]) => {
        setFee(feeData);
        setPayments(paymentData || []);
      })
      .catch((err) => setLoadError(err.message || "Failed to load fee"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handlePaymentSuccess() {
    setPaymentModalOpen(false);
    loadFee();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFee(deleteTarget.id);
      navigate("/fees", { replace: true });
    } catch (err) {
      setLoadError(err.message || "Failed to delete fee");
      setDeleteTarget(null);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <div className="room-form-loading">Loading fee details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadError || !fee) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <div className="room-page-error">{loadError || "Fee not found"}</div>
        </div>
      </DashboardLayout>
    );
  }

  const charges = [
    { label: "Monthly Rent", value: fee.monthly_rent },
    { label: "Electricity", value: fee.electricity_charge },
    { label: "Water", value: fee.water_charge },
    { label: "Maintenance", value: fee.maintenance_charge },
    { label: "Other Charges", value: fee.other_charge },
    { label: "Fine", value: fee.fine },
    { label: "Discount", value: -fee.discount, isDiscount: true },
  ];

  return (
    <DashboardLayout>
      <div className="room-page">
        <button className="room-back-link" onClick={() => navigate("/fees")}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Fees
        </button>

        <div className="room-profile-header">
          <div className="room-profile-icon fee-profile-icon">
            <svg viewBox="0 0 24 24" fill="none" width="30" height="30">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="room-profile-heading">
            <h1>
              {MONTHS[fee.month - 1]} {fee.year} Fee
            </h1>
            <div className="room-profile-meta">
              <span>{fee.student_name}</span>
              <span>·</span>
              <span>{fee.hostel_name} · Room {fee.room_number}</span>
              <span className={`room-badge ${STATUS_BADGE[fee.payment_status] || ""}`}>
                {fee.payment_status}
              </span>
            </div>
          </div>

          <div className="room-profile-actions">
            {fee.payment_status !== "Paid" && (
              <button
                className="room-btn-primary"
                onClick={() => setPaymentModalOpen(true)}
              >
                Record Payment
              </button>
            )}
            <button
              className="room-btn-danger"
              onClick={() => setDeleteTarget(fee)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="fee-summary-strip">
          <div>
            <span className="fee-summary-label">Total Amount</span>
            <span className="fee-summary-value">
              ₹{Number(fee.total_amount).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="fee-summary-label">Paid</span>
            <span className="fee-summary-value fee-summary-paid">
              ₹{Number(fee.paid_amount).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="fee-summary-label">Remaining</span>
            <span className="fee-summary-value fee-summary-due">
              ₹{Number(fee.remaining_amount).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="fee-summary-label">Due Date</span>
            <span className="fee-summary-value">
              {new Date(fee.due_date).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>

        <div className="room-profile-grid">
          <div className="room-panel">
            <div className="room-profile-section-title">Charges Breakdown</div>
            <div className="room-profile-fields">
              {charges.map((c) => (
                <div className="room-profile-field" key={c.label}>
                  <span className="room-profile-field-label">{c.label}</span>
                  <span
                    className={`room-profile-field-value ${
                      c.isDiscount ? "fee-discount-value" : ""
                    }`}
                  >
                    {c.isDiscount && c.value < 0 ? "− " : ""}₹
                    {Math.abs(Number(c.value || 0)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
            {fee.remarks && (
              <>
                <div className="room-profile-section-title fee-remarks-title">
                  Remarks
                </div>
                <p className="room-profile-description">{fee.remarks}</p>
              </>
            )}
          </div>

          <div className="room-panel">
            <div className="room-profile-section-title">Payment History</div>
            <PaymentHistoryList payments={payments} onChanged={loadFee} />
          </div>
        </div>
      </div>

      {paymentModalOpen && (
        <RecordPaymentModal
          fee={fee}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <DeleteFeeModal
        fee={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default FeeDetails;
