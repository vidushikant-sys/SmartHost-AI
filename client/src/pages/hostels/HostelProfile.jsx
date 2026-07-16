import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteHostelModal from "../../components/hostel/DeleteHostelModal";
import { getHostelById, deleteHostel } from "../../services/hostelService";
import "../../styles/hostel.css";

function formatCurrency(value) {
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function HostelProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchHostel = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getHostelById(id);
      setHostel(data);
    } catch (err) {
      setLoadError(err.message || "Could not load this hostel.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHostel();
  }, [fetchHostel]);

  async function handleConfirmDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteHostel(id);
      navigate("/hostels", { state: { justDeleted: true } });
    } catch (err) {
      setDeleteError(err.message || "Could not delete hostel.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="hostel-page">
        <div className="hostel-table__state">
          <div className="hostel-spinner" aria-hidden="true" />
          <p>Loading hostel...</p>
        </div>
      </div>
    );
  }

  if (loadError || !hostel) {
    return (
      <div className="hostel-page">
        <div className="hostel-table__state hostel-table__state--empty">
          <p>{loadError || "Hostel not found."}</p>
          <Link to="/hostels" className="btn btn--ghost">
            Back to Hostels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hostel-page">
      <Link to="/hostels" className="hostel-breadcrumb-back">
        ← Back to Hostels
      </Link>

      {deleteError && <div className="hostel-banner hostel-banner--error">{deleteError}</div>}

      <div className="hostel-profile">
        <div className="hostel-profile__hero" data-type={hostel.hostel_type}>
          <div>
            <span className="hostel-badge hostel-badge--on-hero" data-type={hostel.hostel_type}>
              {hostel.hostel_type}
            </span>
            <h1>{hostel.title}</h1>
            <p className="hostel-profile__location">
              {hostel.address}, {hostel.city}, {hostel.state}, {hostel.country} —{" "}
              {hostel.pincode}
            </p>
          </div>

          <div className="hostel-profile__hero-actions">
            <Link to={`/hostels/${hostel.id}/edit`} className="btn btn--secondary">
              Edit
            </Link>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => setDeleteTarget(hostel)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="hostel-profile__grid">
          <div className="hostel-profile__stat">
            <span>Monthly Fee</span>
            <strong>{formatCurrency(hostel.monthly_fee)}</strong>
          </div>
          <div className="hostel-profile__stat">
            <span>Total Capacity</span>
            <strong>{hostel.total_capacity ?? "—"} beds</strong>
          </div>
          <div className="hostel-profile__stat">
            <span>Bedrooms</span>
            <strong>{hostel.bedrooms ?? 0}</strong>
          </div>
          <div className="hostel-profile__stat">
            <span>Bathrooms</span>
            <strong>{hostel.bathrooms ?? 0}</strong>
          </div>
        </div>

        <div className="hostel-profile__section">
          <h2>Description</h2>
          <p>{hostel.description}</p>
        </div>

        <div className="hostel-profile__section">
          <h2>Amenities</h2>
          {Array.isArray(hostel.amenities) && hostel.amenities.length > 0 ? (
            <div className="hostel-form__selected-amenities">
              {hostel.amenities.map((amenity) => (
                <span className="hostel-chip hostel-chip--static" key={amenity}>
                  {amenity}
                </span>
              ))}
            </div>
          ) : (
            <p className="hostel-profile__muted">No amenities listed.</p>
          )}
        </div>

        <div className="hostel-profile__footer">
          <span>Listed on {formatDate(hostel.created_at)}</span>
          <span>Last updated {formatDate(hostel.updated_at)}</span>
        </div>
      </div>

      <DeleteHostelModal
        hostel={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
