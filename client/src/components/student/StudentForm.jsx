import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../ui/InputField";

// ==========================================================
// StudentForm
// Shared, sectioned form used by both the "Add Student" and
// "Edit Student" pages. The parent page owns the actual save
// call — this component only collects + validates input.
//
// Props:
//  - initialValues: object (prefilled for edit, {} for add)
//  - onSubmit(values): async fn — throws with .errors on failure
//  - submitLabel: string
//  - serverError: string (top-level error banner)
// ==========================================================

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  gender: "",
  date_of_birth: "",
  aadhaar_number: "",
  guardian_name: "",
  guardian_phone: "",
  emergency_contact: "",
  college_name: "",
  course: "",
  semester: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  admission_date: "",
  status: "Active",
};

function StudentForm({ initialValues, onSubmit, submitLabel = "Save Student" }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      setForm({ ...EMPTY_FORM, ...initialValues });
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSubmitError("");
    try {
      await onSubmit(form);
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
    <form className="student-form" onSubmit={handleSubmit}>
      {submitError && <div className="student-form-error-banner">{submitError}</div>}

      <div className="student-form-section">
        <div className="student-form-section-header">
          <span className="student-form-section-num">1</span>
          <div>
            <h3>Personal Details</h3>
            <p>Basic identity information about the student.</p>
          </div>
        </div>
        <div className="student-form-grid">
          <InputField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} required />
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} required />
          <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
          <InputField label="Gender" as="select" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} error={errors.gender} required />
          <InputField label="Date of Birth" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} error={errors.date_of_birth} required />
          <InputField label="Aadhaar Number" name="aadhaar_number" value={form.aadhaar_number} onChange={handleChange} error={errors.aadhaar_number} required />
        </div>
      </div>

      <div className="student-form-section">
        <div className="student-form-section-header">
          <span className="student-form-section-num">2</span>
          <div>
            <h3>Guardian Details</h3>
            <p>Emergency and parent/guardian contact info.</p>
          </div>
        </div>
        <div className="student-form-grid">
          <InputField label="Guardian Name" name="guardian_name" value={form.guardian_name} onChange={handleChange} error={errors.guardian_name} required />
          <InputField label="Guardian Phone" name="guardian_phone" value={form.guardian_phone} onChange={handleChange} error={errors.guardian_phone} required />
          <InputField label="Emergency Contact" name="emergency_contact" value={form.emergency_contact} onChange={handleChange} error={errors.emergency_contact} />
        </div>
      </div>

      <div className="student-form-section">
        <div className="student-form-section-header">
          <span className="student-form-section-num">3</span>
          <div>
            <h3>Education Details</h3>
            <p>Where and what the student is studying.</p>
          </div>
        </div>
        <div className="student-form-grid">
          <InputField label="College Name" name="college_name" value={form.college_name} onChange={handleChange} error={errors.college_name} required />
          <InputField label="Course" name="course" value={form.course} onChange={handleChange} error={errors.course} required />
          <InputField label="Semester" name="semester" value={form.semester} onChange={handleChange} error={errors.semester} required />
        </div>
      </div>

      <div className="student-form-section">
        <div className="student-form-section-header">
          <span className="student-form-section-num">4</span>
          <div>
            <h3>Address Details</h3>
            <p>Permanent home address of the student.</p>
          </div>
        </div>
        <div className="student-form-grid">
          <InputField label="Address" as="textarea" name="address" value={form.address} onChange={handleChange} error={errors.address} required />
          <div className="student-form-grid-2col">
            <InputField label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} required />
            <InputField label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} required />
          </div>
          <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required />
        </div>
      </div>

      <div className="student-form-section">
        <div className="student-form-section-header">
          <span className="student-form-section-num">5</span>
          <div>
            <h3>Hostel Details</h3>
            <p>Admission date and current status.</p>
          </div>
        </div>
        <div className="student-form-grid">
          <InputField label="Admission Date" type="date" name="admission_date" value={form.admission_date} onChange={handleChange} error={errors.admission_date} required />
          <InputField label="Status" as="select" name="status" value={form.status} onChange={handleChange} options={["Active", "Inactive", "Left"]} error={errors.status} />
        </div>
      </div>

      <div className="student-form-actions">
        <button type="button" className="student-btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="student-btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
