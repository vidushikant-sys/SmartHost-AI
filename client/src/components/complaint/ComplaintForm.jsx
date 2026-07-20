import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../services/studentService";

// ==========================================================
// ComplaintForm
// Used on the "File Complaint" page. Search + pick a student,
// then title/description/category/priority.
// ==========================================================

const CATEGORIES = [
  "Electricity", "Water", "Food", "Cleaning", "Maintenance", "Security", "Other",
];
const PRIORITIES = ["Low", "Medium", "High", "Emergency"];

function ComplaintForm({ onSubmit }) {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const pickerRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("Medium");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllStudents()
      .then((data) => setStudents(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setStudentDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return students.slice(0, 8);
    return students
      .filter(
        (s) =>
          s.full_name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.phone?.includes(q)
      )
      .slice(0, 8);
  }, [students, studentQuery]);

  function handleSelectStudent(student) {
    setSelectedStudent(student);
    setStudentQuery(student.full_name);
    setStudentDropdownOpen(false);
    setErrors((e) => ({ ...e, student_id: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    if (!selectedStudent) {
      setErrors({ student_id: "Please select a student." });
      return;
    }

    setSubmitting(true);
    const payload = {
      student_id: selectedStudent.id,
      title,
      description,
      category,
      priority,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setSubmitError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="fee-form" onSubmit={handleSubmit}>
      {submitError && <div className="fee-form-error-banner">{submitError}</div>}

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">1</span>
          <div>
            <h3>Student</h3>
            <p>Who this complaint is being filed on behalf of.</p>
          </div>
        </div>

        <div className="input-group fee-student-picker" ref={pickerRef}>
          <label>
            Student<span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={studentQuery}
            onChange={(e) => {
              setStudentQuery(e.target.value);
              setSelectedStudent(null);
              setStudentDropdownOpen(true);
            }}
            onFocus={() => setStudentDropdownOpen(true)}
            className={errors.student_id ? "input-error" : ""}
          />
          {studentDropdownOpen && filteredStudents.length > 0 && (
            <div className="fee-student-dropdown">
              {filteredStudents.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className="fee-student-option"
                  onClick={() => handleSelectStudent(s)}
                >
                  <span className="fee-student-option-name">{s.full_name}</span>
                  <span className="fee-student-option-meta">
                    {s.hostel_name || "No hostel"} · {s.room_number || "No room"}
                  </span>
                </button>
              ))}
            </div>
          )}
          {errors.student_id && <span className="field-error">{errors.student_id}</span>}
        </div>
      </div>

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">2</span>
          <div>
            <h3>Complaint Details</h3>
            <p>What's the issue, and how urgent is it.</p>
          </div>
        </div>

        <div className="input-group">
          <label>
            Title<span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary, e.g. 'Fan not working in room A101'"
            maxLength={150}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="input-group" style={{ marginTop: 16 }}>
          <label>
            Description<span className="required">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full details of the issue..."
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </div>

        <div className="fee-form-grid" style={{ marginTop: 16 }}>
          <div className="input-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="fee-form-actions">
        <button
          type="button"
          className="fee-btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button type="submit" className="fee-btn-primary" disabled={submitting}>
          {submitting ? "Filing..." : "File Complaint"}
        </button>
      </div>
    </form>
  );
}

export default ComplaintForm;
