import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import HostelStats from "../../components/hostel/HostelStats";
import HostelFilters from "../../components/hostel/HostelFilters";
import HostelTable from "../../components/hostel/HostelTable";
import DeleteHostelModal from "../../components/hostel/DeleteHostelModal";
import { getAllHostels, deleteHostel } from "../../services/hostelService";
import "../../styles/hostel.css";

const DEFAULT_FILTERS = { search: "", hostel_type: "", sortBy: "newest" };

export default function HostelList() {
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message }

  const fetchHostels = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getAllHostels();
      setHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || "Could not load hostels.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  const filteredHostels = useMemo(() => {
    let list = [...hostels];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.title?.toLowerCase().includes(q) ||
          h.city?.toLowerCase().includes(q)
      );
    }

    if (filters.hostel_type) {
      list = list.filter((h) => h.hostel_type === filters.hostel_type);
    }

    switch (filters.sortBy) {
      case "fee_asc":
        list.sort((a, b) => (a.monthly_fee ?? 0) - (b.monthly_fee ?? 0));
        break;
      case "fee_desc":
        list.sort((a, b) => (b.monthly_fee ?? 0) - (a.monthly_fee ?? 0));
        break;
      case "capacity_desc":
        list.sort((a, b) => (b.total_capacity ?? 0) - (a.total_capacity ?? 0));
        break;
      default:
        list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return list;
  }, [hostels, filters]);

  function handleView(hostel) {
    navigate(`/hostels/${hostel.id}`);
  }

  function handleEdit(hostel) {
    navigate(`/hostels/${hostel.id}/edit`);
  }

  async function handleConfirmDelete(hostel) {
    setDeleting(true);
    try {
      await deleteHostel(hostel.id);
      setHostels((prev) => prev.filter((h) => h.id !== hostel.id));
      setBanner({ type: "success", message: `"${hostel.title}" was deleted.` });
      setDeleteTarget(null);
    } catch (err) {
      setBanner({ type: "error", message: err.message || "Could not delete hostel." });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="hostel-page">
        <div className="hostel-page__header">
          <div>
            <h1>Hostels</h1>
            <p>Manage every listed hostel — capacity, pricing, and details, all in one place.</p>
          </div>
          <Link to="/hostels/add" className="btn btn--primary">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Hostel
          </Link>
        </div>

        {banner && (
          <div className={`hostel-banner hostel-banner--${banner.type}`}>{banner.message}</div>
        )}

        <HostelStats hostels={hostels} />

        <div className="hostel-page__panel">
          <HostelFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />

          {loadError ? (
            <div className="hostel-table__state hostel-table__state--empty">
              <p>{loadError}</p>
              <button type="button" className="btn btn--ghost" onClick={fetchHostels}>
                Try again
              </button>
            </div>
          ) : (
            <HostelTable
              hostels={filteredHostels}
              loading={loading}
              onView={handleView}
              onEdit={handleEdit}
              onDeleteRequest={setDeleteTarget}
            />
          )}
        </div>

        <DeleteHostelModal
          hostel={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}