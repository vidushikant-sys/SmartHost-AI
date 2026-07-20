import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../services/studentService";
import { getStudentAllocation } from "../../services/allocationService";
import { getRoomById } from "../../services/roomService";
import { getStudentMonthFee } from "../../services/feeService";

// ==========================================================
// FeeForm
// Used by the "Generate Fee" page. Flow:
//  1. Admin searches + picks a student
//  2. We look up that student's active room allocation, then
//     the room itself — hostel_id, room_id and a suggested
//     monthly_rent (from the room's monthly_fee) all auto-fill
//  3. Admin picks month/year — we check for a duplicate fee
//     and block early with a clear message if one exists
//  4. Charge fields (rent/electricity/water/maintenance/other/
//     fine/discount) live-compute the total as you type
//
// Props:
//  - onSubmit(payload): async fn — throws with .message on failure
// ==========================================================

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function currentYear() {
  return new Date().getFullYear();
}

const EMPTY_CHARGES = {
  monthly_rent: "",
  electricity_charge: "0",
  water_charge: "0",
  maintenance_charge: "0",
  other_charge: "0",
  discount: "0",
  fine: "0",
};

function FeeForm({ onSubmit }) {
  const navigate = useNavigate();

  // ---- Student picker ----
  const [students, setStudents] = useState([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const pickerRef = useRef(null);

  // ---- Auto-resolved room/hostel ----
  const [allocation, setAllocation] = useState(null);
  const [room, setRoom] = useState(null);
  const [resolvingRoom, setResolvingRoom] = useState(false);
  const [noAllocationWarning, setNoAllocationWarning] = useState("");

  // ---- Fee fields ----
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear());
  const [dueDate, setDueDate] = useState(todayISO());
  const [charges, setCharges] = useState(EMPTY_CHARGES);
  const [remarks, setRemarks] = useState("");

  // ---- Duplicate check ----
  const [duplicateFee, setDuplicateFee] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // ---- Submit state ----
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
    setDuplicateFee(null);
  }

  // Resolve the student's active room -> hostel + suggested rent
  useEffect(() => {
    if (!selectedStudent) {
      setAllocation(null);
      setRoom(null);
      setNoAllocationWarning("");
      return;
    }

    setResolvingRoom(true);
    setNoAllocationWarning("");
    getStudentAllocation(selectedStudent.id)
      .then((alloc) => {
        if (!alloc) {
          setAllocation(null);
          setRoom(null);
          setNoAllocationWarning(
            `${selectedStudent.full_name} isn't allocated to a room yet — allocate a room first before generating a fee.`
          );
          return;
        }
        setAllocation(alloc);
        return getRoomById(alloc.room_id).then((r) => {
          setRoom(r);
          setCharges((c) => ({
            ...c,
            monthly_rent: c.monthly_rent || String(r.monthly_fee ?? ""),
          }));
        });
      })
      .catch(() => setNoAllocationWarning("Couldn't resolve this student's room. Try again."))
      .finally(() => setResolvingRoom(false));
  }, [selectedStudent]);

  // Duplicate-month check once we know the student + month/year
  useEffect(() => {
    if (!selectedStudent || !month || !year) {
      setDuplicateFee(null);
      return;
    }
    setCheckingDuplicate(true);
    getStudentMonthFee(selectedStudent.id, month, year)
      .then((fee) => setDuplicateFee(fee))
      .catch(() => setDuplicateFee(null))
      .finally(() => setCheckingDuplicate(false));
  }, [selectedStudent, month, year]);

  function handleChargeChange(e) {
    const { name, value } = e.target;
    setCharges((c) => ({ ...c, [name]: value }));
  }

  const totals = useMemo(() => {
    const num = (v) => (v === "" || v === undefined ? 0 : Number(v) || 0);
    const total =
      num(charges.monthly_rent) +
      num(charges.electricity_charge) +
      num(charges.water_charge) +
      num(charges.maintenance_charge) +
      num(charges.other_charge) +
      num(charges.fine) -
      num(charges.discount);
    return { total: Math.max(0, total) };
  }, [charges]);

  const canSubmit =
    selectedStudent && room && !duplicateFee && !resolvingRoom && !checkingDuplicate;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError("");

    const payload = {
      student_id: selectedStudent.id,
      hostel_id: room.hostel_id,
      room_id: room.id,
      month: Number(month),
      year: Number(year),
      due_date: dueDate,
      monthly_rent: Number(charges.monthly_rent) || 0,
      electricity_charge: Number(charges.electricity_charge) || 0,
      water_charge: Number(charges.water_charge) || 0,
      maintenance_charge: Number(charges.maintenance_charge) || 0,
      other_charge: Number(charges.other_charge) || 0,
      discount: Number(charges.discount) || 0,
      fine: Number(charges.fine) || 0,
      remarks: remarks || undefined,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
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
            <h3>Student & Room</h3>
            <p>Search for the student — their room and hostel fill in automatically.</p>
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
                  <span className="fee-student-option-meta">{s.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {resolvingRoom && (
          <div className="fee-info-banner">Looking up this student's room...</div>
        )}

        {noAllocationWarning && (
          <div className="fee-warning-banner">{noAllocationWarning}</div>
        )}

        {room && allocation && (
          <div className="fee-resolved-room">
            <div>
              <span className="fee-resolved-label">Room</span>
              <span className="fee-resolved-value">{room.room_number}</span>
            </div>
            <div>
              <span className="fee-resolved-label">Hostel</span>
              <span className="fee-resolved-value">{room.hostel_name || "—"}</span>
            </div>
            <div>
              <span className="fee-resolved-label">Room Rent</span>
              <span className="fee-resolved-value">
                ₹{Number(room.monthly_fee || 0).toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>
        )}

        {duplicateFee && (
          <div className="fee-warning-banner">
            A fee for {MONTHS[month - 1]} {year} already exists for this student
            (₹{Number(duplicateFee.total_amount).toLocaleString("en-IN")},{" "}
            {duplicateFee.payment_status}).{" "}
            <button
              type="button"
              className="fee-inline-link"
              onClick={() => navigate(`/fees/${duplicateFee.id}`)}
            >
              View it instead →
            </button>
          </div>
        )}
      </div>

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">2</span>
          <div>
            <h3>Billing Period</h3>
            <p>Which month this fee covers, and when it's due.</p>
          </div>
        </div>
        <div className="fee-form-grid">
          <div className="input-group">
            <label>
              Month<span className="required">*</span>
            </label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>
              Year<span className="required">*</span>
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={2000}
              max={2100}
            />
          </div>
          <div className="input-group">
            <label>
              Due Date<span className="required">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">3</span>
          <div>
            <h3>Charges</h3>
            <p>Rent is suggested from the room's monthly fee — adjust anything as needed.</p>
          </div>
        </div>
        <div className="fee-form-grid">
          <div className="input-group">
            <label>
              Monthly Rent (₹)<span className="required">*</span>
            </label>
            <input
              type="number"
              name="monthly_rent"
              value={charges.monthly_rent}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
          <div className="input-group">
            <label>Electricity (₹)</label>
            <input
              type="number"
              name="electricity_charge"
              value={charges.electricity_charge}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
          <div className="input-group">
            <label>Water (₹)</label>
            <input
              type="number"
              name="water_charge"
              value={charges.water_charge}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
          <div className="input-group">
            <label>Maintenance (₹)</label>
            <input
              type="number"
              name="maintenance_charge"
              value={charges.maintenance_charge}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
          <div className="input-group">
            <label>Other Charges (₹)</label>
            <input
              type="number"
              name="other_charge"
              value={charges.other_charge}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
          <div className="input-group">
            <label>Fine (₹)</label>
            <input
              type="number"
              name="fine"
              value={charges.fine}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
          <div className="input-group">
            <label>Discount (₹)</label>
            <input
              type="number"
              name="discount"
              value={charges.discount}
              onChange={handleChargeChange}
              min={0}
            />
          </div>
        </div>

        <div className="fee-total-strip">
          <span>Total Payable</span>
          <span className="fee-total-value">
            ₹{totals.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="fee-form-section">
        <div className="fee-form-section-header">
          <span className="fee-form-section-num">4</span>
          <div>
            <h3>Notes</h3>
            <p>Optional remarks for this fee record.</p>
          </div>
        </div>
        <textarea
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Optional note..."
        />
      </div>

      <div className="fee-form-actions">
        <button
          type="button"
          className="fee-btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="fee-btn-primary"
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Generating..." : "Generate Fee"}
        </button>
      </div>
    </form>
  );
}

export default FeeForm;
