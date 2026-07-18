import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StudentStats from "../../components/student/StudentStats";
import StudentFilters from "../../components/student/StudentFilters";
import StudentTable from "../../components/student/StudentTable";
import DeleteStudentModal from "../../components/student/DeleteStudentModal";
import { getAllStudents, deleteStudent } from "../../services/studentService";
import { useHostel } from "../../context/HostelContext";
import "../../styles/student.css";

const PAGE_SIZE = 8;

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { selectedHostelId, selectedHostel } = useHostel();

  function loadStudents() {
    setLoading(true);
    return getAllStudents(selectedHostelId)
      .then((data) => setStudents(data || []))
      .catch((err) => setErrorMsg(err.message || "Failed to load students"))
      .finally(() => setLoading(false));
  }

  // Re-fetch every time the globally-selected hostel changes.
  useEffect(() => {
    loadStudents();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostelId]);

  function handleDeleteClick(student) {
    setDeleteTarget(student);
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        !q ||
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q);
      const matchesStatus = status === "All" || s.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
      await loadStudents();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete student");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="student-page">
        <div className="student-page-header">
          <div>
            <h1>Students</h1>
            <p className="student-page-subtitle">
              {selectedHostel
                ? `Showing students in ${selectedHostel.title}.`
                : "Manage every student record across your hostels."}
            </p>
          </div>
          <button className="student-btn-primary" onClick={() => navigate("/students/add")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Student
          </button>
        </div>

        {errorMsg && <div className="student-page-error">{errorMsg}</div>}

        <StudentStats students={students} loading={loading} />

        <div className="student-panel">
          <StudentFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            status={status}
            onStatusChange={(v) => { setStatus(v); setPage(1); }}
          />

          <StudentTable
            students={paginated}
            loading={loading}
            onDelete={(student) => handleDeleteClick(student)}
          />

          {!loading && filtered.length > 0 && (
            <div className="student-pagination">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="student-pagination-btns">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </button>
                <span className="student-page-indicator">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteStudentModal
        student={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default StudentList;
