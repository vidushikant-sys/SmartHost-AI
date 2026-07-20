import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FeeStats from "../../components/fee/FeeStats";
import FeeFilters from "../../components/fee/FeeFilters";
import FeeTable from "../../components/fee/FeeTable";
import RecordPaymentModal from "../../components/fee/RecordPaymentModal";
import DeleteFeeModal from "../../components/fee/DeleteFeeModal";
import { getAllFees, getFeeDashboard, deleteFee } from "../../services/feeService";
import { useHostel } from "../../context/HostelContext";
import "../../styles/room.css";
import "../../styles/fee.css";

const PAGE_SIZE = 8;

function FeeList() {
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [month, setMonth] = useState("All");
  const [page, setPage] = useState(1);

  const [paymentTarget, setPaymentTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { selectedHostelId, selectedHostel } = useHostel();

  function loadData() {
    setLoading(true);
    return Promise.all([
      getAllFees(selectedHostelId),
      getFeeDashboard(selectedHostelId).catch(() => null),
    ])
      .then(([feeData, statsData]) => {
        setFees(feeData || []);
        setStats(statsData);
      })
      .catch((err) => setErrorMsg(err.message || "Failed to load fees"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostelId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return fees.filter((f) => {
      const matchesSearch =
        !q ||
        f.student_name?.toLowerCase().includes(q) ||
        f.room_number?.toLowerCase().includes(q);
      const matchesStatus = status === "All" || f.payment_status === status;
      const matchesMonth = month === "All" || String(f.month) === String(month);
      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [fees, search, status, month]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handlePaymentSuccess() {
    setPaymentTarget(null);
    loadData();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFee(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete fee");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-page-header">
          <div>
            <h1>Fees</h1>
            <p className="room-page-subtitle">
              {selectedHostel
                ? `Showing fee records for ${selectedHostel.title}.`
                : "Manage fee records across your hostels."}
            </p>
          </div>
          <button className="room-btn-primary" onClick={() => navigate("/fees/generate")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Generate Fee
          </button>
        </div>

        {errorMsg && <div className="room-page-error">{errorMsg}</div>}

        <FeeStats stats={stats} loading={loading} />

        <div className="room-panel">
          <FeeFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            status={status}
            onStatusChange={(v) => { setStatus(v); setPage(1); }}
            month={month}
            onMonthChange={(v) => { setMonth(v); setPage(1); }}
          />

          <FeeTable
            fees={paginated}
            loading={loading}
            onRecordPayment={(fee) => setPaymentTarget(fee)}
            onDelete={(fee) => setDeleteTarget(fee)}
          />

          {!loading && filtered.length > 0 && (
            <div className="room-pagination">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="room-pagination-btns">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </button>
                <span className="room-page-indicator">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {paymentTarget && (
        <RecordPaymentModal
          fee={paymentTarget}
          onClose={() => setPaymentTarget(null)}
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

export default FeeList;
