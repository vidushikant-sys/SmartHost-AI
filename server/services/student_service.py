from datetime import datetime

from config.extensions import db
from models.student import Student


# ==================================================
# Helper Function
# ==================================================

def student_to_dict(student):

    return {
        "id": student.id,
        "full_name": student.full_name,
        "email": student.email,
        "phone": student.phone,
        "gender": student.gender,
        "date_of_birth": str(student.date_of_birth),
        "aadhaar_number": student.aadhaar_number,
        "college_name": student.college_name,
        "course": student.course,
        "semester": student.semester,
        "guardian_name": student.guardian_name,
        "guardian_phone": student.guardian_phone,
        "emergency_contact": student.emergency_contact,
        "address": student.address,
        "city": student.city,
        "state": student.state,
        "pincode": student.pincode,
        "profile_photo": student.profile_photo,
        "id_proof": student.id_proof,
        "admission_date": str(student.admission_date),
        "status": student.status,
        "created_at": str(student.created_at),
        "updated_at": str(student.updated_at)
    }


# ==================================================
# Create Student
# ==================================================

def create_student(data):

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
# Get All Students
# ==================================================

def get_all_students():

    students = Student.query.order_by(Student.id.desc()).all()

    return [student_to_dict(student) for student in students]


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