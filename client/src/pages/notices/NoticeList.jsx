import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import NoticeStats from "../../components/notice/NoticeStats";
import NoticeFilters from "../../components/notice/NoticeFilters";
import NoticeGrid from "../../components/notice/NoticeGrid";
import DeleteNoticeModal from "../../components/notice/DeleteNoticeModal";
import {
  getAllNotices,
  getNoticeStats,
  deleteNotice,
} from "../../services/noticeService";
import { useHostel } from "../../context/HostelContext";
import "../../styles/room.css";
import "../../styles/fee.css";
import "../../styles/notice.css";

function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { selectedHostelId, selectedHostel } = useHostel();

  function loadData() {
    setLoading(true);
    return Promise.all([
      getAllNotices(selectedHostelId),
      getNoticeStats(selectedHostelId).catch(() => null),
    ])
      .then(([data, statsData]) => {
        setNotices(data || []);
        setStats(statsData);
      })
      .catch((err) => setErrorMsg(err.message || "Failed to load notices"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostelId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notices.filter((n) => {
      const matchesSearch =
        !q ||
        n.title?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q);
      const matchesCategory = category === "All" || n.category === category;
      const matchesPriority = priority === "All" || n.priority === priority;
      const matchesStatus = status === "All" || n.status === status;
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [notices, search, category, priority, status]);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNotice(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete notice");
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
            <h1>Notices</h1>
            <p className="room-page-subtitle">
              {selectedHostel
                ? `Showing notices for ${selectedHostel.title} (plus any global announcements).`
                : "Manage announcements across your hostels."}
            </p>
          </div>
          <button className="room-btn-primary" onClick={() => navigate("/notices/new")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Post Notice
          </button>
        </div>

        {errorMsg && <div className="room-page-error">{errorMsg}</div>}

        <NoticeStats stats={stats} loading={loading} />

        <div className="room-panel">
          <NoticeFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            priority={priority}
            onPriorityChange={setPriority}
            status={status}
            onStatusChange={setStatus}
          />

          <NoticeGrid
            notices={filtered}
            loading={loading}
            onDelete={(n) => setDeleteTarget(n)}
          />
        </div>
      </div>

      <DeleteNoticeModal
        notice={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default NoticeList;
