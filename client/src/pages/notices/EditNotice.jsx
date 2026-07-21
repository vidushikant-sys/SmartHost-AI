import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import NoticeForm from "../../components/notice/NoticeForm";
import { getNoticeById, updateNotice } from "../../services/noticeService";
import "../../styles/room.css";
import "../../styles/fee.css";
import "../../styles/notice.css";

function EditNotice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    getNoticeById(id)
      .then((data) => mounted && setNotice(data))
      .catch((err) => mounted && setLoadError(err.message || "Failed to load notice"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleSubmit(values) {
    await updateNotice(id, values);
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
          <h1>Edit Notice</h1>
          <p className="room-page-subtitle">Update this announcement.</p>
        </div>

        {loading ? (
          <div className="room-form-loading">Loading notice...</div>
        ) : loadError ? (
          <div className="room-page-error">{loadError}</div>
        ) : (
          <NoticeForm
            initialValues={notice}
            isEdit
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default EditNotice;
