import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import NoticeForm from "../../components/notice/NoticeForm";
import { createNotice } from "../../services/noticeService";
import "../../styles/room.css";
import "../../styles/fee.css";
import "../../styles/notice.css";

function AddNotice() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    await createNotice(values);
    navigate("/notices", { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-form-header">
          <button className="room-back-link" onClick={() => navigate("/notices")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Notices
          </button>
          <h1>Post Notice</h1>
          <p className="room-page-subtitle">
            Share an announcement with students.
          </p>
        </div>

        <NoticeForm onSubmit={handleSubmit} submitLabel="Post Notice" />
      </div>
    </DashboardLayout>
  );
}

export default AddNotice;
