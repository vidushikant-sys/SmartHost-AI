import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeleteStudentModal from "../../components/student/DeleteStudentModal";
import { getStudentById, deleteStudent } from "../../services/studentService";
import "../../styles/student.css";

// ==========================================================
// StudentProfile
// Read-only detail view for a single student, with Edit and
// Delete actions. Route: /students/:id
// ==========================================================

const STATUS_BADGE = {
  Active: "badge-active",
  Inactive: "badge-inactive",
  Left: "badge-left",
};

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "?"
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Field({ label, value }) {
  return (
    <div className="student-profile-field">
      <span className="student-profile-field-label">{label}</span>
      <span className="student-profile-field-value">{value || "—"}</span>
    </div>
  );
}

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getStudentById(id)
      .then((data) => mounted && setStudent(data))
      .catch((err) => mounted && setErrorMsg(err.message || "Failed to load student"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await deleteStudent(id);
      navigate("/students", { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete student");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="student-page">
          <div className="student-form-loading">Loading student profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (errorMsg && !student) {
    return (
      <DashboardLayout>
        <div className="student-page">
          <button className="student-back-link" onClick={() => navigate("/students")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Students
          </button>
          <div className="student-page-error">{errorMsg}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="student-page">
        <button className="student-back-link" onClick={() => navigate("/students")}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Students
        </button>

        {errorMsg && <div className="student-page-error">{errorMsg}</div>}

        {/* ---------- Profile header card ---------- */}
        <div className="student-profile-header">
          <div className="student-profile-avatar">{initials(student.full_name)}</div>

          <div className="student-profile-heading">
            <h1>{student.full_name}</h1>
            <div className="student-profile-meta">
              <span>{student.course} · {student.college_name}</span>
              <span className={`student-badge ${STATUS_BADGE[student.status] || ""}`}>
                {student.status}
              </span>
            </div>
          </div>

          <div className="student-profile-actions">
            <button
              className="student-btn-secondary"
              onClick={() => navigate(`/students/${id}/edit`)}
            >
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
            <button className="student-btn-danger" onClick={() => setDeleteTarget(student)}>
              Delete
            </button>
          </div>
        </div>

        {/* ---------- Detail sections ---------- */}
        <div className="student-profile-grid">
          <div className="student-panel">
            <h3 className="student-profile-section-title">Personal Details</h3>
            <div className="student-profile-fields">
              <Field label="Email" value={student.email} />
              <Field label="Phone" value={student.phone} />
              <Field label="Gender" value={student.gender} />
              <Field label="Date of Birth" value={formatDate(student.date_of_birth)} />
              <Field label="Aadhaar Number" value={student.aadhaar_number} />
            </div>
          </div>

          <div className="student-panel">
            <h3 className="student-profile-section-title">Guardian Details</h3>
            <div className="student-profile-fields">
              <Field label="Guardian Name" value={student.guardian_name} />
              <Field label="Guardian Phone" value={student.guardian_phone} />
              <Field label="Emergency Contact" value={student.emergency_contact} />
            </div>
          </div>

          <div className="student-panel">
            <h3 className="student-profile-section-title">Education Details</h3>
            <div className="student-profile-fields">
              <Field label="College Name" value={student.college_name} />
              <Field label="Course" value={student.course} />
              <Field label="Semester" value={student.semester} />
            </div>
          </div>

          <div className="student-panel">
            <h3 className="student-profile-section-title">Address Details</h3>
            <div className="student-profile-fields">
              <Field label="Address" value={student.address} />
              <Field label="City" value={student.city} />
              <Field label="State" value={student.state} />
              <Field label="Pincode" value={student.pincode} />
            </div>
          </div>

          <div className="student-panel">
            <h3 className="student-profile-section-title">Hostel Details</h3>
            <div className="student-profile-fields">
              <Field label="Admission Date" value={formatDate(student.admission_date)} />
              <Field label="Status" value={student.status} />
            </div>
          </div>
        </div>
      </div>

      <DeleteStudentModal
        student={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default StudentProfile;
