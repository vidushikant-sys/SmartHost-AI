import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AllocateRoomModal from "../../components/student/AllocateRoomModal";
import { getAllStudents } from "../../services/studentService";
import "../../styles/student.css";
import "../../styles/room.css";
import "../../styles/allocation.css";

// ==========================================================
// AllocateRoomPage  (/rooms/allocate)
// Quick-access page (linked from the Dashboard's Quick Actions)
// for allocating rooms to students in bulk — e.g. move-in day,
// when a warden wants to go through everyone waiting on a room
// without opening each student's profile individually.
//
// Lists students with no active allocation; clicking "Allocate"
// opens the same AllocateRoomModal used on the Student Profile
// page, so there's only one allocation form/flow in the app.
// ==========================================================

function AllocateRoomPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [activeStudent, setActiveStudent] = useState(null);

  const navigate = useNavigate();

  function loadStudents() {
    setLoading(true);
    return getAllStudents()
      .then((data) => setStudents(data || []))
      .catch((err) => setErrorMsg(err.message || "Failed to load students"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const unallocated = useMemo(
    () => students.filter((s) => s.allocation_status !== "Allocated"),
    [students]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return unallocated;
    return unallocated.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q)
    );
  }, [unallocated, search]);

  function handleSuccess() {
    setActiveStudent(null);
    loadStudents();
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <button className="room-back-link" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </button>

        <div className="room-page-header">
          <div>
            <h1>Allocate Room</h1>
            <p className="room-page-subtitle">
              Students waiting on a room — {loading ? "…" : unallocated.length} unallocated.
            </p>
          </div>
        </div>

        {errorMsg && <div className="room-page-error">{errorMsg}</div>}

        <div className="room-panel">
          <div className="room-search" style={{ maxWidth: 360, marginBottom: 18 }}>
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search unallocated students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="room-skeleton-row" />
          ) : filtered.length === 0 ? (
            <div className="room-empty-state">
              <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>
                {unallocated.length === 0
                  ? "Every student already has a room. Nothing to allocate."
                  : "No students match your search."}
              </p>
            </div>
          ) : (
            <div className="allocation-page-list">
              {filtered.map((s) => (
                <div className="allocation-page-row" key={s.id}>
                  <div>
                    <div className="room-cell-title">{s.full_name}</div>
                    <div className="room-cell-sub">{s.email} · {s.phone}</div>
                  </div>
                  <button
                    className="room-btn-primary"
                    onClick={() => setActiveStudent(s)}
                  >
                    Allocate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeStudent && (
        <AllocateRoomModal
          student={activeStudent}
          mode="allocate"
          onClose={() => setActiveStudent(null)}
          onSuccess={handleSuccess}
        />
      )}
    </DashboardLayout>
  );
}

export default AllocateRoomPage;
