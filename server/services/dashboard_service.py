from sqlalchemy import func
from datetime import datetime

from config.extensions import db

from models.property import Property
from models.room import Room
from models.student import Student
from models.fee import Fee
from models.notice import Notice
from models.complaint import Complaint
from models.activity_log import ActivityLog


# ==================================================
# Dashboard Service
# ==================================================

def get_dashboard_data():

    # ==========================================
    # Hostel Statistics
    # ==========================================

    total_hostels = Property.query.count()

    # ==========================================
    # Room Statistics
    # ==========================================

    total_rooms = Room.query.count()

    available_rooms = Room.query.filter(
        Room.available_beds > 0
    ).count()

    occupied_rooms = Room.query.filter(
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

    total_students = Student.query.count()

    active_students = Student.query.filter_by(
        status="Active"
    ).count()

    inactive_students = Student.query.filter(
        Student.status != "Active"
    ).count()


    # ==========================================
    # Recent Students
    # ==========================================

    recent_students = (

        Student.query

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

    latest_notices = (

        Notice.query

        .filter_by(status="Active")

        .order_by(Notice.created_at.desc())

        .limit(5)

        .all()

    )
        # ==========================================
    # Fee Statistics
    # ==========================================

    total_fee_generated = db.session.query(

        func.sum(Fee.total_amount)

    ).scalar() or 0

    total_collection = db.session.query(

        func.sum(Fee.paid_amount)

    ).scalar() or 0

    pending_amount = db.session.query(

        func.sum(Fee.remaining_amount)

    ).scalar() or 0

    pending_fees = Fee.query.filter_by(

        payment_status="Pending"

    ).count()

    partial_fees = Fee.query.filter_by(

        payment_status="Partial"

    ).count()

    paid_fees = Fee.query.filter_by(

        payment_status="Paid"

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

            Fee.month == month

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

    total_complaints = Complaint.query.count()

    pending_complaints = Complaint.query.filter_by(
        status="Open"
    ).count()

    resolved_complaints = Complaint.query.filter_by(
        status="Resolved"
    ).count()


    # ==========================================
    # Notice Statistics
    # ==========================================

    total_notices = Notice.query.count()

    active_notices = Notice.query.filter_by(
        status="Active"
    ).count()

    expired_notices = Notice.query.filter_by(
        status="Expired"
    ).count()


    # ==========================================
    # Final Dashboard Response
    # ==========================================

    return {

        "hostel": {

            "total_hostels": total_hostels

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