import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StudentForm from "../../components/student/StudentForm";
import { createStudent } from "../../services/studentService";
import "../../styles/student.css";

function AddStudent() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const created = await createStudent(values); // throws with .errors on validation failure
    navigate(`/students/${created.id}`, { replace: true });
  }

  return (
    <DashboardLayout>
      <div className="student-page">
        <div className="student-form-header">
          <button className="student-back-link" onClick={() => navigate("/students")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Students
          </button>
          <h1>Add New Student</h1>
          <p className="student-page-subtitle">
            Fill in the student's details to create a new record.
          </p>
        </div>

        <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
      </div>
    </DashboardLayout>
  );
}

export default AddStudent;
