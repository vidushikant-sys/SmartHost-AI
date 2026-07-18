from datetime import datetime

from sqlalchemy import and_, or_, func
from sqlalchemy.orm import joinedload

from config.extensions import db

from models.student import Student
from models.room_allocation import RoomAllocation
from models.room import Room
from models.property import Property
from models.fee import Fee
from models.complaint import Complaint

from validators.student_validator import StudentValidator

# ==================================================
# Helper Function
# ==================================================
# ==================================================
# Get Active Allocation
# ==================================================

def get_active_allocation(student_id):

    return (

        RoomAllocation.query

        .filter_by(

            student_id=student_id,

            allocation_status="Allocated"

        )

        .first()

    )


# ==================================================
# Get Fee Information
# ==================================================

def get_fee_information(student_id):

    fee = (

        Fee.query

        .filter_by(student_id=student_id)

        .order_by(Fee.created_at.desc())

        .first()

    )

    if fee is None:

        return {

            "fee_status": "Not Generated",

            "pending_amount": 0,

            "total_fee": 0,

            "paid_amount": 0

        }

    return {

        "fee_status": fee.payment_status,

        "pending_amount": float(fee.remaining_amount),

        "total_fee": float(fee.total_amount),

        "paid_amount": float(fee.paid_amount)

    }


#==================================================
# Complaint Summary (Total / Open / Resolved)
# ==================================================

def get_complaint_summary(student_id):

    rows = (

        db.session.query(

            Complaint.status,

            func.count(Complaint.id)

        )

        .filter(

            Complaint.student_id == student_id

        )

        .group_by(

            Complaint.status

        )

        .all()

    )

    counts = {status: count for status, count in rows}

    total = sum(counts.values())

    resolved = counts.get("Resolved", 0)

    # "Open" bucket covers both "Open" and "In Progress" tickets —
    # anything that hasn't reached "Resolved" yet.
    open_count = total - resolved

    return {

        "total": total,

        "open": open_count,

        "resolved": resolved

    }
# ==================================================
# Student To Dictionary (Enhanced)
# ==================================================

def student_to_dict(student):

    allocation = get_active_allocation(student.id)

    fee = get_fee_information(student.id)

    complaints = get_complaint_summary(student.id)

    hostel_id = None
    hostel_name = None
    room_number = None
    allocation_status = "Not Allocated"

    if allocation:

        allocation_status = allocation.allocation_status

        if allocation.room:

            room_number = allocation.room.room_number

            hostel_id = allocation.room.hostel_id

            if allocation.room.hostel:

                hostel_name = allocation.room.hostel.title

    return {

        # ======================================
        # Basic Information
        # ======================================

        "id": student.id,

        "full_name": student.full_name,

        "email": student.email,

        "phone": student.phone,

        "gender": student.gender,

        "date_of_birth": (

            str(student.date_of_birth)

            if student.date_of_birth

            else None

        ),

        "aadhaar_number": student.aadhaar_number,

        # ======================================
        # Education
        # ======================================

        "college_name": student.college_name,

        "course": student.course,

        "semester": student.semester,

        # ======================================
        # Guardian
        # ======================================

        "guardian_name": student.guardian_name,

        "guardian_phone": student.guardian_phone,

        "emergency_contact": student.emergency_contact,

        # ======================================
        # Address
        # ======================================

        "address": student.address,

        "city": student.city,

        "state": student.state,

        "pincode": student.pincode,

        # ======================================
        # Documents
        # ======================================

        "profile_photo": student.profile_photo,

        "id_proof": student.id_proof,

        # ======================================
        # Hostel Information
        # ======================================

        "hostel_id": hostel_id,

        "hostel_name": hostel_name,

        "room_number": room_number,

        "allocation_status": allocation_status,

        # ======================================
        # Fee Information
        # ======================================

        "fee_status": fee["fee_status"],

"pending_amount": fee["pending_amount"],

"paid_amount": fee["paid_amount"],

"total_fee": fee["total_fee"],

        # ======================================
        # Complaint
        # ======================================

        "complaint_count": complaints["total"],

        "complaint_open": complaints["open"],

        "complaint_resolved": complaints["resolved"],

        # ======================================
        # Status
        # ======================================

        "status": student.status,

        "admission_date": (

            str(student.admission_date)

            if student.admission_date

            else None

        ),

        # ======================================
        # Timestamp
        # ======================================

        "created_at": (

            str(student.created_at)

            if student.created_at

            else None

        ),

        "updated_at": (

            str(student.updated_at)

            if student.updated_at

            else None

        )

    }

# ==================================================
# Create Student
# ==================================================

def create_student(data):
    # ==================================================
    # Validate Request
    # ==================================================

    is_valid, errors = StudentValidator.validate(data)

    if not is_valid:
        return None, errors

    # Duplicate Email
    if Student.query.filter_by(email=data.get("email")).first():
        return None, "Email already exists"

    # Duplicate Phone
    if Student.query.filter_by(phone=data.get("phone")).first():
        return None, "Phone number already exists"

    # Duplicate Aadhaar
    aadhaar = data.get("aadhaar_number")

    if aadhaar:
        if Student.query.filter_by(aadhaar_number=aadhaar).first():
            return None, "Aadhaar number already exists"

    # Date Conversion
    dob = datetime.strptime(
        data.get("date_of_birth"),
        "%Y-%m-%d"
    ).date()

    admission_date = datetime.strptime(
        data.get("admission_date"),
        "%Y-%m-%d"
    ).date()

    student = Student(

        full_name=data.get("full_name"),

        email=data.get("email"),

        phone=data.get("phone"),

        gender=data.get("gender"),

        date_of_birth=dob,

        aadhaar_number=aadhaar,

        college_name=data.get("college_name"),

        course=data.get("course"),

        semester=data.get("semester"),

        guardian_name=data.get("guardian_name"),

        guardian_phone=data.get("guardian_phone"),

        emergency_contact=data.get("emergency_contact"),

        address=data.get("address"),

        city=data.get("city"),

        state=data.get("state"),

        pincode=data.get("pincode"),

        profile_photo=data.get("profile_photo"),

        id_proof=data.get("id_proof"),

        admission_date=admission_date,

        status=data.get("status", "Active")

    )

    db.session.add(student)

    db.session.commit()

    return student, None
# ==================================================
# Get All Students (Optimized)
# ==================================================

def get_all_students(hostel_id=None):

    query = (

        Student.query

        .options(

            joinedload(Student.allocations)

            .joinedload(RoomAllocation.room)

            .joinedload(Room.hostel)

        )

    )

    # A student has no direct hostel_id column — hostel is derived
    # through their room allocation. Filter to students who have an
    # (active) allocation to a room belonging to the selected hostel.
    if hostel_id:

        query = (

            query

            .join(Student.allocations)

            .join(RoomAllocation.room)

            .filter(Room.hostel_id == hostel_id)

        )

    students = (

        query

        .order_by(Student.id.desc())

        .all()

    )

    return [

        student_to_dict(student)

        for student in students

    ]
# ==================================================
# Get Student By ID
# ==================================================

def get_student_by_id(student_id):

    student = Student.query.get(student_id)

    if student is None:
        return None

    return student_to_dict(student)
# ==================================================
# Update Student
# ==================================================

def update_student(student_id, data):
    # ==================================================
    # Validate Request
    # ==================================================

    is_valid, errors = StudentValidator.validate(data)

    if not is_valid:
        return None, errors

    student = Student.query.get(student_id)

    if student is None:
        return None, "Student not found"

    # Email Duplicate Check
    existing_email = Student.query.filter_by(
        email=data.get("email")
    ).first()

    if existing_email and existing_email.id != student.id:
        return None, "Email already exists"

    # Phone Duplicate Check
    existing_phone = Student.query.filter_by(
        phone=data.get("phone")
    ).first()

    if existing_phone and existing_phone.id != student.id:
        return None, "Phone number already exists"

    # Aadhaar Duplicate Check
    aadhaar = data.get("aadhaar_number")

    if aadhaar:

        existing_aadhaar = Student.query.filter_by(
            aadhaar_number=aadhaar
        ).first()

        if existing_aadhaar and existing_aadhaar.id != student.id:
            return None, "Aadhaar number already exists"

    # Date Conversion
    dob = datetime.strptime(
        data.get("date_of_birth"),
        "%Y-%m-%d"
    ).date()

    admission_date = datetime.strptime(
        data.get("admission_date"),
        "%Y-%m-%d"
    ).date()

    # Update Fields
    student.full_name = data.get("full_name")
    student.email = data.get("email")
    student.phone = data.get("phone")
    student.gender = data.get("gender")
    student.date_of_birth = dob
    student.aadhaar_number = aadhaar
    student.college_name = data.get("college_name")
    student.course = data.get("course")
    student.semester = data.get("semester")
    student.guardian_name = data.get("guardian_name")
    student.guardian_phone = data.get("guardian_phone")
    student.emergency_contact = data.get("emergency_contact")
    student.address = data.get("address")
    student.city = data.get("city")
    student.state = data.get("state")
    student.pincode = data.get("pincode")
    student.profile_photo = data.get("profile_photo")
    student.id_proof = data.get("id_proof")
    student.admission_date = admission_date
    student.status = data.get("status")

    db.session.commit()

    return student, None
# ==================================================
# Delete Student
# ==================================================

def delete_student(student_id):

    student = Student.query.get(student_id)

    if student is None:
        return False

    db.session.delete(student)

    db.session.commit()

    return True