from sqlalchemy import func

from config.extensions import db

from models.property import Property
from models.room import Room
from models.student import Student
from models.fee import Fee
from models.complaint import Complaint
from models.notice import Notice



# ==================================================
# Admin Dashboard Statistics
# ==================================================

def get_dashboard_data():


    # ==============================================
    # Hostel Statistics
    # ==============================================

    total_hostels = Property.query.count()



    # ==============================================
    # Room Statistics
    # ==============================================

    total_rooms = Room.query.count()



    available_rooms = Room.query.filter(
        Room.available_beds > 0
    ).count()



    occupied_rooms = Room.query.filter(
        Room.available_beds == 0
    ).count()



    # ==============================================
    # Student Statistics
    # ==============================================

    total_students = Student.query.count()



    active_students = Student.query.filter_by(
        status="Active"
    ).count()



    inactive_students = Student.query.filter(
        Student.status != "Active"
    ).count()



    # ==============================================
    # Fee Statistics
    # ==============================================

    total_fees = db.session.query(
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



    # ==============================================
    # Complaint Statistics
    # ==============================================

    total_complaints = Complaint.query.count()



    pending_complaints = Complaint.query.filter_by(
        status="Pending"
    ).count()



    resolved_complaints = Complaint.query.filter_by(
        status="Resolved"
    ).count()



    # ==============================================
    # Notice Statistics
    # ==============================================

    total_notices = Notice.query.count()



    active_notices = Notice.query.filter_by(
        status="Active"
    ).count()



    expired_notices = Notice.query.filter_by(
        status="Expired"
    ).count()



    # ==============================================
    # Final Dashboard Response
    # ==============================================

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

            "inactive_students": inactive_students

        },


        "fees": {

            "total_fee_generated": total_fees,

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

        }

    }