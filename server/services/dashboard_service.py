from sqlalchemy import func
from datetime import datetime

from config.extensions import db

from models.property import Property
from models.room import Room
from models.student import Student
from models.room_allocation import RoomAllocation
from models.fee import Fee
from models.notice import Notice
from models.complaint import Complaint
from models.activity_log import ActivityLog


# ==================================================
# Dashboard Service
# ==================================================

def get_dashboard_data(hostel_id=None):

    # ==========================================
    # Hostel Statistics
    # ==========================================
    # total_hostels always reflects the admin's whole portfolio —
    # even with a hostel selected, it's still useful context.

    total_hostels = Property.query.count()

    # ==========================================
    # Room Statistics
    # ==========================================

    room_query = Room.query

    if hostel_id:
        room_query = room_query.filter(Room.hostel_id == hostel_id)

    total_rooms = room_query.count()

    available_rooms = room_query.filter(
        Room.available_beds > 0
    ).count()

    occupied_rooms = room_query.filter(
        Room.available_beds == 0
    ).count()

    occupancy_percentage = 0

    if total_rooms > 0:

        occupancy_percentage = round(

            (occupied_rooms / total_rooms) * 100,

            2

        )

    available_percentage = round(

        100 - occupancy_percentage,

        2

    )
        # ==========================================
    # Student Statistics
    # ==========================================

    student_query = Student.query

    if hostel_id:
        student_query = (
            student_query
            .join(RoomAllocation, RoomAllocation.student_id == Student.id)
            .join(Room, RoomAllocation.room_id == Room.id)
            .filter(Room.hostel_id == hostel_id)
        )

    total_students = student_query.count()

    active_students = student_query.filter(
        Student.status == "Active"
    ).count()

    inactive_students = student_query.filter(
        Student.status != "Active"
    ).count()


    # ==========================================
    # Recent Students
    # ==========================================

    recent_students = (

        student_query

        .order_by(Student.created_at.desc())

        .limit(5)

        .all()

    )


    # ==========================================
    # Recent Activities
    # ==========================================

    recent_activities = (

        ActivityLog.query

        .order_by(ActivityLog.created_at.desc())

        .limit(8)

        .all()

    )


    # ==========================================
    # Latest Active Notices
    # ==========================================

    notice_query = Notice.query

    if hostel_id:
        notice_query = notice_query.filter(
            (Notice.hostel_id == hostel_id) |
            (Notice.hostel_id.is_(None))
        )

    latest_notices = (

        notice_query

        .filter_by(status="Active")

        .order_by(Notice.created_at.desc())

        .limit(5)

        .all()

    )
        # ==========================================
    # Fee Statistics
    # ==========================================

    fee_query = Fee.query

    if hostel_id:
        fee_query = fee_query.filter(Fee.hostel_id == hostel_id)

    fee_sum_filter = [Fee.hostel_id == hostel_id] if hostel_id else []

    total_fee_generated = db.session.query(

        func.sum(Fee.total_amount)

    ).filter(*fee_sum_filter).scalar() or 0

    total_collection = db.session.query(

        func.sum(Fee.paid_amount)

    ).filter(*fee_sum_filter).scalar() or 0

    pending_amount = db.session.query(

        func.sum(Fee.remaining_amount)

    ).filter(*fee_sum_filter).scalar() or 0

    pending_fees = fee_query.filter(

        Fee.payment_status == "Pending"

    ).count()

    partial_fees = fee_query.filter(

        Fee.payment_status == "Partial"

    ).count()

    paid_fees = fee_query.filter(

        Fee.payment_status == "Paid"

    ).count()


    # ==========================================
    # Monthly Revenue Analytics
    # ==========================================

    current_year = datetime.now().year

    months = []

    collections = []

    for month in range(1, 13):

        monthly_collection = db.session.query(

            func.sum(Fee.paid_amount)

        ).filter(

            Fee.year == current_year,

            Fee.month == month,

            *fee_sum_filter

        ).scalar() or 0

        months.append(month)

        collections.append(float(monthly_collection))


    # ==========================================
    # Revenue Summary
    # ==========================================

    highest_collection = max(collections) if collections else 0

    average_collection = round(

        sum(collections) / 12,

        2

    )
        # ==========================================
    # Complaint Statistics
    # ==========================================

    complaint_query = Complaint.query

    if hostel_id:
        complaint_query = (
            complaint_query
            .join(Student, Complaint.student_id == Student.id)
            .join(RoomAllocation, RoomAllocation.student_id == Student.id)
            .join(Room, RoomAllocation.room_id == Room.id)
            .filter(Room.hostel_id == hostel_id)
        )

    total_complaints = complaint_query.count()

    pending_complaints = complaint_query.filter(
        Complaint.status == "Open"
    ).count()

    resolved_complaints = complaint_query.filter(
        Complaint.status == "Resolved"
    ).count()


    # ==========================================
    # Notice Statistics
    # ==========================================
    # A hostel's notice count includes its own notices plus any
    # global (hostel_id=NULL) notices.

    notice_stats_query = Notice.query

    if hostel_id:
        notice_stats_query = notice_stats_query.filter(
            (Notice.hostel_id == hostel_id) |
            (Notice.hostel_id.is_(None))
        )

    total_notices = notice_stats_query.count()

    active_notices = notice_stats_query.filter(
        Notice.status == "Active"
    ).count()

    expired_notices = notice_stats_query.filter(
        Notice.status == "Expired"
    ).count()


    # ==========================================
    # Final Dashboard Response
    # ==========================================

    return {

        "hostel": {

            "total_hostels": total_hostels,

            "selected_hostel_id": hostel_id

        },

        "rooms": {

            "total_rooms": total_rooms,

            "available_rooms": available_rooms,

            "occupied_rooms": occupied_rooms

        },

        "students": {

            "total_students": total_students,

            "active_students": active_students,

            "inactive_students": inactive_students,

            "recent_students": [

                {

                    "id": student.id,

                    "name": student.full_name,

                    "course": student.course,

                    "semester": student.semester,

                    "status": student.status,

                    "created_at": str(student.created_at)

                }

                for student in recent_students

            ]

        },

        "fees": {

            "total_fee_generated": total_fee_generated,

            "total_collection": total_collection,

            "pending_amount": pending_amount,

            "pending_fees": pending_fees,

            "partial_fees": partial_fees,

            "paid_fees": paid_fees

        },

        "complaints": {

            "total_complaints": total_complaints,

            "pending_complaints": pending_complaints,

            "resolved_complaints": resolved_complaints

        },

        "notices": {

            "total_notices": total_notices,

            "active_notices": active_notices,

            "expired_notices": expired_notices

        },

        "recent_activities": [

            {

                "id": activity.id,

                "module": activity.module,

                "action": activity.action,

                "description": activity.description,

                "admin": (

                    activity.admin.email

                    if activity.admin

                    else None

                ),

                "created_at": str(activity.created_at)

            }

            for activity in recent_activities

        ],

        "latest_notices": [

            {

                "id": notice.id,

                "title": notice.title,

                "category": notice.category,

                "priority": notice.priority,

                "status": notice.status,

                "expiry_date": (

                    str(notice.expiry_date)

                    if notice.expiry_date

                    else None

                ),

                "created_at": str(notice.created_at)

            }

            for notice in latest_notices

        ],

        "analytics": {

            "monthly_revenue": {

                "months": months,

                "collections": collections,

                "highest_collection": highest_collection,

                "average_collection": average_collection

            },

            "occupancy": {

                "occupied": occupied_rooms,

                "available": available_rooms,

                "occupied_percentage": occupancy_percentage,

                "available_percentage": available_percentage

            }

        }

    }