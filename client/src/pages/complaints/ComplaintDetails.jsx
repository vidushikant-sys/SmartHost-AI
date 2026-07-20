import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusUpdateModal from "../../components/complaint/StatusUpdateModal";
import DeleteComplaintModal from "../../components/complaint/DeleteComplaintModal";
import { getComplaintById, deleteComplaint } from "../../services/complaintService";
import "../../styles/room.css";
import "../../styles/fee.css";
import "../../styles/complaint.css";

const STATUS_BADGE = {
  Open: "badge-left",
  "In Progress": "badge-inactive",
  Resolved: "badge-active",
};

const PRIORITY_DOT = {
  Emergency: "#DC2626",
  High: "#F97316",
  Medium: "#EAB308",
  Low: "#94A3B8",
};

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [respondOpen, setRespondOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function loadComplaint() {
    setLoading(true);
    return getComplaintById(id)
      .then((data) => setComplaint(data))
      .catch((err) => setLoadError(err.message || "Failed to load complaint"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleRespondSuccess() {
    setRespondOpen(false);
    loadComplaint();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteComplaint(deleteTarget.id);
      navigate("/complaints", { replace: true });
    } catch (err) {
      setLoadError(err.message || "Failed to delete complaint");
      setDeleteTarget(null);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <div className="room-form-loading">Loading complaint...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadError || !complaint) {
    return (
      <DashboardLayout>
        <div className="room-page">
          <div className="room-page-error">{loadError || "Complaint not found"}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <button className="room-back-link" onClick={() => navigate("/complaints")}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Complaints
        </button>

        <div className="room-profile-header">
          <div className="room-profile-icon complaint-profile-icon">
            <svg viewBox="0 0 24 24" fill="none" width="30" height="30">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="room-profile-heading">
            <h1>{complaint.title}</h1>
            <div className="room-profile-meta">
              <span>{complaint.student_name}</span>
              <span>·</span>
              <span>{complaint.hostel_name || "—"} · {complaint.room_number || "—"}</span>
              <span className={`room-badge ${STATUS_BADGE[complaint.status] || ""}`}>
                {complaint.status}
              </span>
            </div>
          </div>

          <div className="room-profile-actions">
            {complaint.status !== "Resolved" && (
              <button className="room-btn-primary" onClick={() => setRespondOpen(true)}>
                Respond
              </button>
            )}
            <button className="room-btn-danger" onClick={() => setDeleteTarget(complaint)}>
              Delete
            </button>
          </div>
        </div>

        <div className="room-profile-grid">
          <div className="room-panel">
            <div className="room-profile-section-title">Complaint Details</div>
            <div className="room-profile-fields">
              <div className="room-profile-field">
                <span className="room-profile-field-label">Category</span>
                <span className="room-profile-field-value">{complaint.category}</span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Priority</span>
                <span className="room-profile-field-value complaint-priority-cell">
                  <span
                    className="complaint-priority-dot"
                    style={{ background: PRIORITY_DOT[complaint.priority] }}
                  />
                  {complaint.priority}
                </span>
              </div>
              <div className="room-profile-field">
                <span className="room-profile-field-label">Filed On</span>
                <span className="room-profile-field-value">
                  {new Date(complaint.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              {complaint.resolved_at && (
                <div className="room-profile-field">
                  <span className="room-profile-field-label">Resolved On</span>
                  <span className="room-profile-field-value">
                    {new Date(complaint.resolved_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <div className="room-profile-section-title fee-remarks-title">
              Description
            </div>
            <p className="room-profile-description">{complaint.description}</p>
          </div>

          <div className="room-panel">
            <div className="room-profile-section-title">Admin Response</div>
            {complaint.admin_reply ? (
              <p className="room-profile-description">{complaint.admin_reply}</p>
            ) : (
              <p className="room-profile-description">
                No response yet.{" "}
                {complaint.status !== "Resolved" && (
                  <button
                    type="button"
                    className="fee-inline-link"
                    onClick={() => setRespondOpen(true)}
                  >
                    Respond now →
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {respondOpen && (
        <StatusUpdateModal
          complaint={complaint}
          onClose={() => setRespondOpen(false)}
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

export default ComplaintDetails;
