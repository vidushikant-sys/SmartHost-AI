from datetime import date

from config.extensions import db
from models.notice import Notice
from models.student import Student
from models.room_allocation import RoomAllocation
from models.room import Room
from validators.notice_validator import NoticeValidator
from services.notification_service import notify_student


# ==================================================
# Helper — Notify students affected by a notice
# ==================================================
# A Notice has no single student_id (it's a hostel-wide announcement),
# but Notification rows are always tied to one student. So when a
# notice is published, we fan it out: one Notification row per
# affected student.
#   - hostel_id set   -> only students currently allocated to a room
#                        in that hostel.
#   - hostel_id is None (global notice) -> every active student.
# ==================================================

def _notify_students_for_notice(notice):

    query = Student.query.filter_by(status="Active")

    if notice.hostel_id:
        query = query.filter(
            Student.allocations.any(
                (RoomAllocation.allocation_status == "Allocated") &
                RoomAllocation.room.has(Room.hostel_id == notice.hostel_id)
            )
        )

    students = query.all()

    for student in students:
        notify_student(
            student.id,
            f"New Notice: {notice.title}",
            notice.description,
            type="Notice"
        )


# ==================================================
# Create Notice
# ==================================================

def create_notice(data):
    is_valid, errors = NoticeValidator.validate(data)
    if not is_valid:
        return None, errors

    notice = Notice(

        title=data.get("title"),

        description=data.get("description"),

        category=data.get(
            "category",
            "General"
        ),

        priority=data.get(
            "priority",
            "Normal"
        ),

        created_by=data.get(
            "created_by"
        ),

        expiry_date=data.get(
            "expiry_date"
        ),

        # hostel_id is optional — leave it unset (None) to create a
        # global notice visible under every hostel.
        hostel_id=data.get(
            "hostel_id"
        ) or None,

        status="Active"

    )


    db.session.add(notice)

    db.session.commit()

    _notify_students_for_notice(notice)

    return notice, None



# ==================================================
# Get All Notices
# ==================================================

def get_all_notices(hostel_id=None):


    query = Notice.query

    # When a hostel is selected, show that hostel's notices PLUS any
    # global notice (hostel_id is NULL) so hostel-wide announcements
    # still show up under every hostel.
    if hostel_id:

        query = query.filter(
            (Notice.hostel_id == hostel_id) |
            (Notice.hostel_id.is_(None))
        )

    notices = query.order_by(
        Notice.created_at.desc()
    ).all()


    # Auto expiry check

    today = date.today()


    for notice in notices:

        if (
            notice.expiry_date
            and notice.expiry_date < today
        ):

            notice.status = "Expired"


    db.session.commit()


    return [
        notice.to_dict()
        for notice in notices
    ]


# ==================================================
# Get Notice By ID
# ==================================================

def get_notice_by_id(notice_id):


    notice = Notice.query.get(
        notice_id
    )


    return notice


# ==================================================
# Update Notice
# ==================================================

def update_notice(
        notice_id,
        data
):

    is_valid, errors = NoticeValidator.validate_update(data)
    if not is_valid:
        return None, errors

    notice = Notice.query.get(
        notice_id
    )


    if not notice:

        return None, "Notice not found"


    if "title" in data:

        notice.title = data["title"]


    if "description" in data:

        notice.description = data["description"]


    if "category" in data:

        notice.category = data["category"]


    if "priority" in data:

        notice.priority = data["priority"]


    if "expiry_date" in data:

        notice.expiry_date = data["expiry_date"]


    if "status" in data:

        notice.status = data["status"]


    db.session.commit()


    return notice, None


# ==================================================
# Delete Notice
# ==================================================

def delete_notice(notice_id):


    notice = Notice.query.get(
        notice_id
    )


    if not notice:

        return False



    db.session.delete(
        notice
    )


    db.session.commit()


    return True


# ==================================================
# Notice Dashboard Statistics
# ==================================================

def get_notice_stats():


    total = Notice.query.count()


    active = Notice.query.filter_by(
        status="Active"
    ).count()



    expired = Notice.query.filter_by(
        status="Expired"
    ).count()



    urgent = Notice.query.filter_by(
        priority="Urgent"
    ).count()



    important = Notice.query.filter_by(
        priority="Important"
    ).count()



    return {

        "total_notices": total,

        "active_notices": active,

        "expired_notices": expired,

        "urgent_notices": urgent,

        "important_notices": important

    }