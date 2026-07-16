import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StudentForm from "../../components/student/StudentForm";
import { getStudentById, updateStudent } from "../../services/studentService";
import "../../styles/student.css";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    getStudentById(id)
      .then((data) => mounted && setStudent(data))
      .catch((err) => mounted && setLoadError(err.message || "Failed to load student"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleSubmit(values) {
    await updateStudent(id, values); // throws with .errors on validation failure
    navigate(`/students/${id}`, { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="student-page">
        <div className="student-form-header">
          <button className="student-back-link" onClick={() => navigate(`/students/${id}`)}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Profile
          </button>
          <h1>Edit Student</h1>
          <p className="student-page-subtitle">Update {student?.full_name || "this student's"} details.</p>
        </div>

        {loading ? (
          <div className="student-form-loading">Loading student details...</div>
        ) : loadError ? (
          <div className="student-page-error">{loadError}</div>
        ) : (
          <StudentForm initialValues={student} onSubmit={handleSubmit} submitLabel="Update Student" />
        )}
      </div>
    </DashboardLayout>
  );
}

export default EditStudent;
