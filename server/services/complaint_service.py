from datetime import datetime

from config.extensions import db

from models.complaint import Complaint
from models.student import Student



# ==================================================
# Create Complaint
# ==================================================

def create_complaint(data):

    complaint = Complaint(

        student_id=data.get("student_id"),

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


    return complaint



# ==================================================
# Get All Complaints
# ==================================================

def get_all_complaints():

    complaints = Complaint.query.order_by(
        Complaint.created_at.desc()
    ).all()


    return [
        complaint.to_dict()
        for complaint in complaints
    ]



# ==================================================
# Get Complaint By ID
# ==================================================

def get_complaint_by_id(complaint_id):

    complaint = Complaint.query.get(
        complaint_id
    )


    if not complaint:
        return None


    return complaint



# ==================================================
# Get Student Complaints
# ==================================================

def get_student_complaints(student_id):

    complaints = Complaint.query.filter_by(
        student_id=student_id
    ).order_by(
        Complaint.created_at.desc()
    ).all()


    return [
        complaint.to_dict()
        for complaint in complaints
    ]



# ==================================================
# Update Complaint
# ==================================================

def update_complaint(
        complaint_id,
        data
):

    complaint = Complaint.query.get(
        complaint_id
    )


    if not complaint:
        return None



    if "status" in data:

        complaint.status = data["status"]


        if data["status"] == "Resolved":

            complaint.resolved_at = datetime.now()



    if "priority" in data:

        complaint.priority = data["priority"]



    if "admin_reply" in data:

        complaint.admin_reply = data["admin_reply"]



    db.session.commit()


    return complaint



# ==================================================
# Delete Complaint
# ==================================================

def delete_complaint(complaint_id):

    complaint = Complaint.query.get(
        complaint_id
    )


    if not complaint:
        return False



    db.session.delete(
        complaint
    )

    db.session.commit()


    return True



# ==================================================
# Complaint Dashboard Statistics
# ==================================================

def get_complaint_stats():


    total = Complaint.query.count()


    open_count = Complaint.query.filter_by(
        status="Open"
    ).count()



    progress_count = Complaint.query.filter_by(
        status="In Progress"
    ).count()



    resolved_count = Complaint.query.filter_by(
        status="Resolved"
    ).count()



    high_priority = Complaint.query.filter_by(
        priority="High"
    ).count()



    emergency_priority = Complaint.query.filter_by(
        priority="Emergency"
    ).count()



    return {

        "total_complaints": total,

        "open_complaints": open_count,

        "in_progress_complaints": progress_count,

        "resolved_complaints": resolved_count,

        "high_priority_complaints": high_priority,

        "emergency_complaints": emergency_priority

    }