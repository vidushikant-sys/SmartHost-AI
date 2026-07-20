import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FeeForm from "../../components/fee/FeeForm";
import { createFee } from "../../services/feeService";
import "../../styles/room.css";
import "../../styles/fee.css";

function GenerateFee() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const fee = await createFee(values);
    navigate(`/fees/${fee.id}`, { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-form-header">
          <button className="room-back-link" onClick={() => navigate("/fees")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Fees
          </button>
          <h1>Generate Fee</h1>
          <p className="room-page-subtitle">
            Create a new monthly fee record for a student.
          </p>
        </div>

        <FeeForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}

export default GenerateFee;
