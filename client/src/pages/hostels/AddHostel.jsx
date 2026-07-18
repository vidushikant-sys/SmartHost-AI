import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import HostelForm from "../../components/hostel/HostelForm";
import { createHostel } from "../../services/hostelService";
import "../../styles/hostel.css";

export default function AddHostel() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [topError, setTopError] = useState("");

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerErrors({});
    setTopError("");

    try {
      await createHostel(payload);
      navigate("/hostels", {
        state: { justCreated: true },
      });
    } catch (err) {
      if (err.errors) {
        setServerErrors(err.errors);
      } else {
        setTopError(err.message || "Could not create hostel. Please try again.");
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
            <h1>Add New Hostel</h1>
            <p>Fill in the details below to list a new hostel.</p>
          </div>
        </div>

        {topError && <div className="hostel-banner hostel-banner--error">{topError}</div>}

        <div className="hostel-page__panel">
          <HostelForm
            onSubmit={handleSubmit}
            submitting={submitting}
            serverErrors={serverErrors}
            submitLabel="Add Hostel"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}