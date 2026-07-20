import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeleteStudentModal from "../../components/student/DeleteStudentModal";
import AllocateRoomModal from "../../components/student/AllocateRoomModal";
import VacateRoomModal from "../../components/student/VacateRoomModal";
import { getStudentById, deleteStudent } from "../../services/studentService";
import { resolveFileUrl } from "../../services/apiClient";
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

// Each entry pairs the existing badge color class with a small dot glyph,
// e.g. "🟢 Paid" / "🟠 Partial" / "🔴 Unpaid".
const FEE_META = {
  Paid: { badge: "badge-active", dot: "🟢" },
  Partial: { badge: "badge-inactive", dot: "🟠" },
  Unpaid: { badge: "badge-left", dot: "🔴" },
  "Not Generated": { badge: "badge-inactive", dot: "⚪" },
};

const ALLOCATION_META = {
  Allocated: { badge: "badge-active", dot: "🟢" },
  "Not Allocated": { badge: "badge-inactive", dot: "🟠" },
  Vacated: { badge: "badge-left", dot: "🔴" },
  Transferred: { badge: "badge-inactive", dot: "🔵" },
};

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// Cosmetic student code shown under the profile header, e.g. "STU-0001".
// The backend doesn't (yet) store a dedicated enrollment number, so this
// is derived from the numeric primary key.
function studentCode(id) {
  return `STU-${String(id).padStart(4, "0")}`;
}

function StatusBadge({ status, meta, fallback = "—" }) {
  const info = meta[status];
  return (
    <span className={`student-badge student-badge-dot ${info?.badge || "badge-inactive"}`}>
      <span aria-hidden="true">{info?.dot || "⚪"}</span>
      {status || fallback}
    </span>
  );
}

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // "allocate" | "transfer" | null — which allocation modal is open
  const [allocationModal, setAllocationModal] = useState(null);
  const [vacateModalOpen, setVacateModalOpen] = useState(false);

  function loadStudent() {
    setLoading(true);
    return getStudentById(id)
      .then((data) => setStudent(data))
      .catch((err) => setErrorMsg(err.message || "Failed to load student"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getStudentById(id)
      .then((data) => {
        if (!mounted) return;
        setStudent(data);

        // Came here right after "Add Student" — offer to allocate a room now.
        if (searchParams.get("allocate") === "1" && data.allocation_status !== "Allocated") {
          setAllocationModal("allocate");
        }
        setSearchParams({}, { replace: true });
      })
      .catch((err) => mounted && setErrorMsg(err.message || "Failed to load student"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleAllocationSuccess() {
    setAllocationModal(null);
    setVacateModalOpen(false);
    loadStudent();
  }

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
          {student.profile_photo ? (
            <a
              href={resolveFileUrl(student.profile_photo)}
              target="_blank"
              rel="noreferrer"
              title="View full photo"
              className="student-profile-avatar-link"
            >
              <img
                src={resolveFileUrl(student.profile_photo)}
                alt={student.full_name}
                className="student-profile-avatar student-profile-avatar-img"
              />
            </a>
          ) : (
            <div className="student-profile-avatar">{initials(student.full_name)}</div>
          )}

          <div className="student-profile-heading">
            <h1>{student.full_name}</h1>
            <div className="student-profile-meta">
              <span>{student.course} · {student.college_name}</span>
              <span className={`student-badge ${STATUS_BADGE[student.status] || ""}`}>
                {student.status}
              </span>
            </div>
            <div className="student-profile-code">Student ID: {studentCode(student.id)}</div>
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
              <div className="student-profile-field">
                <span className="student-profile-field-label">ID Proof</span>
                {student.id_proof ? (
                  <a
                    href={resolveFileUrl(student.id_proof)}
                    target="_blank"
                    rel="noreferrer"
                    className="student-profile-doc-link"
                  >
                    📄 View ID Proof
                  </a>
                ) : (
                  <span className="student-profile-field-value">Not Uploaded</span>
                )}
              </div>
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
              <Field label="Hostel" value={student.hostel_name || "Not Assigned"} />
              <Field label="Room Number" value={student.room_number || "Not Allocated"} />
              <div className="student-profile-field">
                <span className="student-profile-field-label">Allocation Status</span>
                <StatusBadge status={student.allocation_status} meta={ALLOCATION_META} />
              </div>
              <Field label="Admission Date" value={formatDate(student.admission_date)} />
              <Field label="Status" value={student.status} />
            </div>

            <div className="student-allocation-actions">
              {student.allocation_status === "Allocated" ? (
                <>
                  <button
                    className="student-btn-secondary"
                    onClick={() => setAllocationModal("transfer")}
                  >
                    Transfer Room
                  </button>
                  <button
                    className="student-btn-danger"
                    onClick={() => setVacateModalOpen(true)}
                  >
                    Vacate Room
                  </button>
                </>
              ) : (
                <button
                  className="student-btn-primary"
                  onClick={() => setAllocationModal("allocate")}
                >
                  Allocate Room
                </button>
              )}
            </div>
          </div>

          <div className="student-panel">
            <h3 className="student-profile-section-title">Fee Details</h3>
            <div className="student-profile-fields">
              <div className="student-profile-field">
                <span className="student-profile-field-label">Fee Status</span>
                <StatusBadge status={student.fee_status} meta={FEE_META} />
              </div>
              <Field label="Total Fee" value={formatCurrency(student.total_fee)} />
              <Field label="Paid Amount" value={formatCurrency(student.paid_amount)} />
              <Field label="Pending Amount" value={formatCurrency(student.pending_amount)} />
            </div>
          </div>

          <div className="student-panel">
            <h3 className="student-profile-section-title">Complaints</h3>
            <div className="student-profile-fields">
              <Field label="Total Complaints" value={student.complaint_count ?? 0} />
              <Field label="Open" value={student.complaint_open ?? 0} />
              <Field label="Resolved" value={student.complaint_resolved ?? 0} />
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

      {allocationModal && (
        <AllocateRoomModal
          student={student}
          mode={allocationModal}
          onClose={() => setAllocationModal(null)}
          onSuccess={handleAllocationSuccess}
        />
      )}

      {vacateModalOpen && (
        <VacateRoomModal
          student={student}
          onClose={() => setVacateModalOpen(false)}
          onSuccess={handleAllocationSuccess}
        />
      )}
    </DashboardLayout>
  );
}

export default StudentProfile;
