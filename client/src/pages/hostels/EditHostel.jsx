import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import HostelForm from "../../components/hostel/HostelForm";
import { getHostelById, updateHostel } from "../../services/hostelService";
import "../../styles/hostel.css";

export default function EditHostel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [topError, setTopError] = useState("");

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

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerErrors({});
    setTopError("");

    try {
      await updateHostel(id, payload);
      navigate(`/hostels/${id}`, { state: { justUpdated: true } });
    } catch (err) {
      if (err.errors) {
        setServerErrors(err.errors);
      } else {
        setTopError(err.message || "Could not update hostel. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="hostel-page">
        <div className="hostel-page__header">
          <div>
            <Link to="/hostels" className="hostel-breadcrumb-back">
              ← Back to Hostels
            </Link>
            <h1>Edit Hostel</h1>
            <p>Update the details for this hostel listing.</p>
          </div>
        </div>

        {topError && <div className="hostel-banner hostel-banner--error">{topError}</div>}

        <div className="hostel-page__panel">
          {loading ? (
            <div className="hostel-table__state">
              <div className="hostel-spinner" aria-hidden="true" />
              <p>Loading hostel...</p>
            </div>
          ) : loadError ? (
            <div className="hostel-table__state hostel-table__state--empty">
              <p>{loadError}</p>
              <button type="button" className="btn btn--ghost" onClick={fetchHostel}>
                Try again
              </button>
            </div>
          ) : (
            <HostelForm
              initialData={hostel}
              onSubmit={handleSubmit}
              submitting={submitting}
              serverErrors={serverErrors}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}