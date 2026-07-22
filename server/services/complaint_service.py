from datetime import datetime

from config.extensions import db

from models.complaint import Complaint
from models.student import Student

from validators.complaint_validator import ComplaintValidator
from services.notification_service import notify_student


# ==================================================
# Helper Function
# ==================================================

def complaint_to_dict(complaint):

    hostel_name = None
    room_number = None

    if complaint.student and complaint.student.allocations:
        active = next(
            (a for a in complaint.student.allocations if a.allocation_status == "Allocated"),
            None,
        )
        if active and active.room:
            room_number = active.room.room_number
            if active.room.hostel:
                hostel_name = active.room.hostel.title

    return {

        "id": complaint.id,

        "student_id": complaint.student_id,

        "student_name": complaint.student.full_name
        if complaint.student
        else None,

        "hostel_name": hostel_name,

        "room_number": room_number,

        "title": complaint.title,

        "description": complaint.description,

        "category": complaint.category,

        "priority": complaint.priority,

        "status": complaint.status,

        "admin_reply": complaint.admin_reply,

        "created_at": str(complaint.created_at),

        "updated_at": str(complaint.updated_at),

        "resolved_at": (
            str(complaint.resolved_at)
            if complaint.resolved_at
            else None
        )

    }


# ==================================================
# Create Complaint
# ==================================================

def create_complaint(data):

    # ==========================================
    # Validate Request
    # ==========================================

    is_valid, errors = ComplaintValidator.validate_create(data)

    if not is_valid:
        return None, errors

    student_id = data.get("student_id")

    # ==========================================
    # Check Student
    # ==========================================

    student = Student.query.get(student_id)

    if student is None:
        return None, "Student not found"

    complaint = Complaint(

        student_id=student_id,

        title=data.get("title"),

        description=data.get("description"),

        category=data.get(
            "category",
            "Other"
        ),

        priority=data.get(
            "priority",
            "Medium"
        ),

        status="Open"

    )

    db.session.add(complaint)

    db.session.commit()

    notify_student(
        student_id,
        "Complaint Registered",
        f"Your complaint \"{complaint.title}\" has been registered and is now Open.",
        type="Complaint"
    )

    return complaint_to_dict(complaint), None
# ==================================================
# Get All Complaints
# ==================================================

def get_all_complaints(hostel_id=None):

    query = Complaint.query

    # Complaint has no direct hostel_id — it's derived through the
    # student's room allocation. Filter to complaints raised by
    # students who have an allocation to a room in the selected hostel.
    if hostel_id:

        from models.room_allocation import RoomAllocation
        from models.room import Room

        query = query.filter(
            Complaint.student_id.in_(
                db.session.query(Student.id).filter(
                    Student.allocations.any(
                        (RoomAllocation.allocation_status == "Allocated") &
                        RoomAllocation.room.has(Room.hostel_id == hostel_id)
                    )
                )
            )
        )

    complaints = query.order_by(
        Complaint.created_at.desc()
    ).all()

    return [
        complaint_to_dict(complaint)
        for complaint in complaints
    ]


# ==================================================
# Get Complaint By ID
# ==================================================

def get_complaint_by_id(complaint_id):

    complaint = Complaint.query.get(complaint_id)

    if complaint is None:
        return None

    return complaint_to_dict(complaint)


# ==================================================
# Get Complaints By Student
# ==================================================

def get_student_complaints(student_id):

    student = Student.query.get(student_id)

    if student is None:
        return None, "Student not found"

    complaints = Complaint.query.filter_by(
        student_id=student_id
    ).order_by(
        Complaint.created_at.desc()
    ).all()

    return [
        complaint_to_dict(complaint)
        for complaint in complaints
    ], None


# ==================================================
# Update Complaint
# ==================================================

def update_complaint(complaint_id, data):

    # ==========================================
    # Validate Request
    # ==========================================

    is_valid, errors = ComplaintValidator.validate_update(data)

    if not is_valid:
        return None, errors

    complaint = Complaint.query.get(complaint_id)

    if complaint is None:
        return None, "Complaint not found"

    if "status" in data:

        complaint.status = data["status"]

        if data["status"] == "Resolved":
            complaint.resolved_at = datetime.now()

    if "priority" in data:
        complaint.priority = data["priority"]

    if "category" in data:
        complaint.category = data["category"]

    if "admin_reply" in data:
        complaint.admin_reply = data["admin_reply"]

    db.session.commit()

    if "status" in data:
        notify_student(
            complaint.student_id,
            "Complaint Status Updated",
            f"Your complaint \"{complaint.title}\" is now marked as {complaint.status}."
            + (f" Admin reply: {complaint.admin_reply}" if complaint.admin_reply else ""),
            type="Complaint"
        )

    return complaint_to_dict(complaint), None
# ==================================================
# Delete Complaint
# ==================================================

def delete_complaint(complaint_id):

    complaint = Complaint.query.get(complaint_id)

    if complaint is None:
        return False

    db.session.delete(complaint)

    db.session.commit()

    return True


# ==================================================
# Complaint Dashboard Statistics
# ==================================================

def get_complaint_stats(hostel_id=None):

    query = Complaint.query

    if hostel_id:

        from models.room_allocation import RoomAllocation
        from models.room import Room

        query = query.filter(
            Complaint.student_id.in_(
                db.session.query(Student.id).filter(
                    Student.allocations.any(
                        (RoomAllocation.allocation_status == "Allocated") &
                        RoomAllocation.room.has(Room.hostel_id == hostel_id)
                    )
                )
            )
        )

    total = query.count()

    open_count = query.filter(
        Complaint.status == "Open"
    ).count()

    in_progress = query.filter(
        Complaint.status == "In Progress"
    ).count()

    resolved = query.filter(
        Complaint.status == "Resolved"
    ).count()

    low_priority = query.filter(
        Complaint.priority == "Low"
    ).count()

    medium_priority = query.filter(
        Complaint.priority == "Medium"
    ).count()

    high_priority = query.filter(
        Complaint.priority == "High"
    ).count()

    emergency_priority = query.filter(
        Complaint.priority == "Emergency"
    ).count()

    return {

        "total_complaints": total,

        "open_complaints": open_count,

        "in_progress_complaints": in_progress,

        "resolved_complaints": resolved,

        "low_priority_complaints": low_priority,

        "medium_priority_complaints": medium_priority,

        "high_priority_complaints": high_priority,

        "emergency_complaints": emergency_priority

    }