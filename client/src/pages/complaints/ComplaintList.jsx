import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ComplaintStats from "../../components/complaint/ComplaintStats";
import ComplaintFilters from "../../components/complaint/ComplaintFilters";
import ComplaintTable from "../../components/complaint/ComplaintTable";
import StatusUpdateModal from "../../components/complaint/StatusUpdateModal";
import DeleteComplaintModal from "../../components/complaint/DeleteComplaintModal";
import {
  getAllComplaints,
  getComplaintStats,
  deleteComplaint,
} from "../../services/complaintService";
import { useHostel } from "../../context/HostelContext";
import "../../styles/room.css";
import "../../styles/fee.css";
import "../../styles/complaint.css";

const PAGE_SIZE = 8;

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);

  const [respondTarget, setRespondTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { selectedHostelId, selectedHostel } = useHostel();

  function loadData() {
    setLoading(true);
    return Promise.all([
      getAllComplaints(selectedHostelId),
      getComplaintStats(selectedHostelId).catch(() => null),
    ])
      .then(([data, statsData]) => {
        setComplaints(data || []);
        setStats(statsData);
      })
      .catch((err) => setErrorMsg(err.message || "Failed to load complaints"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostelId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints.filter((c) => {
      const matchesSearch =
        !q ||
        c.student_name?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.room_number?.toLowerCase().includes(q);
      const matchesStatus = status === "All" || c.status === status;
      const matchesPriority = priority === "All" || c.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, status, priority]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleRespondSuccess() {
    setRespondTarget(null);
    loadData();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteComplaint(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete complaint");
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
            <h1>Complaints</h1>
            <p className="room-page-subtitle">
              {selectedHostel
                ? `Showing complaints for ${selectedHostel.title}.`
                : "Track and resolve student complaints across your hostels."}
            </p>
          </div>
          <button className="room-btn-primary" onClick={() => navigate("/complaints/add")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            File Complaint
          </button>
        </div>

        {errorMsg && <div className="room-page-error">{errorMsg}</div>}

        <ComplaintStats stats={stats} loading={loading} />

        <div className="room-panel">
          <ComplaintFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            status={status}
            onStatusChange={(v) => { setStatus(v); setPage(1); }}
            priority={priority}
            onPriorityChange={(v) => { setPriority(v); setPage(1); }}
          />

          <ComplaintTable
            complaints={paginated}
            loading={loading}
            onRespond={(c) => setRespondTarget(c)}
            onDelete={(c) => setDeleteTarget(c)}
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

      {respondTarget && (
        <StatusUpdateModal
          complaint={respondTarget}
          onClose={() => setRespondTarget(null)}
          onSuccess={handleRespondSuccess}
        />
      )}

      <DeleteComplaintModal
        complaint={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default ComplaintList;
