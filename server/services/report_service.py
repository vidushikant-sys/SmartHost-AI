"""
Report Service
Powers the Reports & Analytics page (client/src/pages/reports/Reports.jsx):
overview KPIs, revenue trend, student growth, cross-hostel performance
comparison, and complaint insights.
"""

from datetime import datetime

from sqlalchemy import func

from config.extensions import db

from models.property import Property
from models.room import Room
from models.student import Student
from models.room_allocation import RoomAllocation
from models.fee import Fee
from models.complaint import Complaint
from models.notice import Notice


MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]


def _students_in_hostel_filter(hostel_id):
    """Reusable predicate: student has an active allocation in hostel_id."""
    return Student.allocations.any(
        (RoomAllocation.allocation_status == "Allocated") &
        RoomAllocation.room.has(Room.hostel_id == hostel_id)
    )


def _last_n_months(count):
    """Returns [{month, year}, ...] for the last `count` months, oldest first."""
    now = datetime.now()
    targets = []
    for i in range(count - 1, -1, -1):
        month = now.month - i
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        targets.append({"month": month, "year": year})
    return targets


# ==================================================
# Overview
# ==================================================

def get_overview_report(hostel_id=None):

    total_hostels = Property.query.count()

    room_query = Room.query
    if hostel_id:
        room_query = room_query.filter(Room.hostel_id == hostel_id)

    total_rooms = room_query.count()
    occupied_rooms = room_query.filter(Room.available_beds == 0).count()
    occupancy_percentage = (
        round((occupied_rooms / total_rooms) * 100, 2) if total_rooms > 0 else 0
    )

    student_query = Student.query
    if hostel_id:
        student_query = student_query.filter(_students_in_hostel_filter(hostel_id))

    total_students = student_query.count()
    active_students = student_query.filter(Student.status == "Active").count()

    fee_filter = [Fee.hostel_id == hostel_id] if hostel_id else []

    total_collection = db.session.query(
        func.sum(Fee.paid_amount)
    ).filter(*fee_filter).scalar() or 0

    total_due = db.session.query(
        func.sum(Fee.remaining_amount)
    ).filter(*fee_filter).scalar() or 0

    complaint_query = Complaint.query
    if hostel_id:
        complaint_query = complaint_query.join(
            Student, Complaint.student_id == Student.id
        ).filter(_students_in_hostel_filter(hostel_id))

    total_complaints = complaint_query.count()
    open_complaints = complaint_query.filter(Complaint.status == "Open").count()

    resolved_with_time = complaint_query.filter(
        Complaint.status == "Resolved",
        Complaint.resolved_at.isnot(None),
    ).all()

    if resolved_with_time:
        total_hours = sum(
            (c.resolved_at - c.created_at).total_seconds() / 3600
            for c in resolved_with_time
        )
        avg_resolution_hours = round(total_hours / len(resolved_with_time), 1)
    else:
        avg_resolution_hours = 0

    notice_query = Notice.query
    if hostel_id:
        notice_query = notice_query.filter(
            (Notice.hostel_id == hostel_id) | (Notice.hostel_id.is_(None))
        )

    total_notices = notice_query.count()
    active_notices = notice_query.filter(Notice.status == "Active").count()

    return {
        "hostels": {
            "total_hostels": total_hostels,
        },
        "rooms": {
            "total_rooms": total_rooms,
            "occupied_rooms": occupied_rooms,
            "occupancy_percentage": occupancy_percentage,
        },
        "students": {
            "total_students": total_students,
            "active_students": active_students,
        },
        "fees": {
            "total_collection": total_collection,
            "total_due": total_due,
        },
        "complaints": {
            "total_complaints": total_complaints,
            "open_complaints": open_complaints,
            "avg_resolution_hours": avg_resolution_hours,
        },
        "notices": {
            "total_notices": total_notices,
            "active_notices": active_notices,
        },
    }


# ==================================================
# Revenue Trend
# ==================================================

def get_revenue_trend(hostel_id=None, months=6):

    fee_filter = [Fee.hostel_id == hostel_id] if hostel_id else []

    labels = []
    generated = []
    collected = []

    for target in _last_n_months(months):

        month_generated = db.session.query(
            func.sum(Fee.total_amount)
        ).filter(
            Fee.month == target["month"],
            Fee.year == target["year"],
            *fee_filter,
        ).scalar() or 0

        month_collected = db.session.query(
            func.sum(Fee.paid_amount)
        ).filter(
            Fee.month == target["month"],
            Fee.year == target["year"],
            *fee_filter,
        ).scalar() or 0

        labels.append(MONTH_LABELS[target["month"] - 1])
        generated.append(float(month_generated))
        collected.append(float(month_collected))

    return {
        "labels": labels,
        "generated": generated,
        "collected": collected,
    }


# ==================================================
# Student Growth
# ==================================================

def get_student_growth(hostel_id=None, months=6):

    labels = []
    counts = []

    for target in _last_n_months(months):

        query = Student.query.filter(
            func.extract("month", Student.created_at) == target["month"],
            func.extract("year", Student.created_at) == target["year"],
        )

        if hostel_id:
            query = query.filter(_students_in_hostel_filter(hostel_id))

        labels.append(MONTH_LABELS[target["month"] - 1])
        counts.append(query.count())

    return {
        "labels": labels,
        "counts": counts,
    }


# ==================================================
# Hostel Performance (cross-hostel comparison)
# ==================================================

def get_hostel_performance():

    hostels = Property.query.all()

    rows = []

    for hostel in hostels:

        room_query = Room.query.filter(Room.hostel_id == hostel.id)
        total_rooms = room_query.count()
        occupied_rooms = room_query.filter(Room.available_beds == 0).count()
        occupancy_percentage = (
            round((occupied_rooms / total_rooms) * 100, 2) if total_rooms > 0 else 0
        )

        total_students = Student.query.filter(
            _students_in_hostel_filter(hostel.id)
        ).count()

        revenue_collected = db.session.query(
            func.sum(Fee.paid_amount)
        ).filter(Fee.hostel_id == hostel.id).scalar() or 0

        revenue_due = db.session.query(
            func.sum(Fee.remaining_amount)
        ).filter(Fee.hostel_id == hostel.id).scalar() or 0

        open_complaints = Complaint.query.join(
            Student, Complaint.student_id == Student.id
        ).filter(
            _students_in_hostel_filter(hostel.id),
            Complaint.status == "Open",
        ).count()

        rows.append({
            "hostel_id": hostel.id,
            "hostel_name": hostel.title,
            "total_rooms": total_rooms,
            "occupied_rooms": occupied_rooms,
            "occupancy_percentage": occupancy_percentage,
            "total_students": total_students,
            "revenue_collected": revenue_collected,
            "revenue_due": revenue_due,
            "open_complaints": open_complaints,
        })

    return rows


# ==================================================
# Complaint Insights
# ==================================================

def get_complaint_insights(hostel_id=None):

    query = Complaint.query
    if hostel_id:
        query = query.join(
            Student, Complaint.student_id == Student.id
        ).filter(_students_in_hostel_filter(hostel_id))

    open_complaints = query.filter(Complaint.status == "Open").count()
    in_progress_complaints = query.filter(Complaint.status == "In Progress").count()
    resolved_complaints = query.filter(Complaint.status == "Resolved").count()

    category_rows = (
        query
        .with_entities(Complaint.category, func.count(Complaint.id))
        .group_by(Complaint.category)
        .all()
    )

    by_category = [
        {"category": category, "count": count}
        for category, count in category_rows
    ]

    return {
        "open_complaints": open_complaints,
        "in_progress_complaints": in_progress_complaints,
        "resolved_complaints": resolved_complaints,
        "by_category": by_category,
    }