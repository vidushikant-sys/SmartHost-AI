from datetime import date

from config.extensions import db

from models.notice import Notice



# ==================================================
# Create Notice
# ==================================================

def create_notice(data):

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

        status="Active"

    )


    db.session.add(notice)

    db.session.commit()


    return notice



# ==================================================
# Get All Notices
# ==================================================

def get_all_notices():


    notices = Notice.query.order_by(
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

    notice = Notice.query.get(
        notice_id
    )


    if not notice:

        return None



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


    return notice



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