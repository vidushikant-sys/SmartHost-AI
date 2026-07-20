import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ComplaintForm from "../../components/complaint/ComplaintForm";
import { createComplaint } from "../../services/complaintService";
import "../../styles/room.css";
import "../../styles/fee.css";

function FileComplaint() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const complaint = await createComplaint(values);
    navigate(`/complaints/${complaint.id}`, { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-form-header">
          <button className="room-back-link" onClick={() => navigate("/complaints")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Complaints
          </button>
          <h1>File Complaint</h1>
          <p className="room-page-subtitle">
            Log a new complaint on behalf of a student.
          </p>
        </div>

        <ComplaintForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}

export default FileComplaint;
