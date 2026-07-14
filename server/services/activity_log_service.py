from config.extensions import db

from models.activity_log import ActivityLog
from models.admin import Admin

from validators.activity_log_validator import (
    ActivityLogValidator
)


# ==========================================================
# Create Activity Log
# ==========================================================

def create_activity_log(data):

    is_valid, errors = ActivityLogValidator.validate(data)

    if not is_valid:

        return None, errors

    try:

        activity_log = ActivityLog(

            admin_id=data["admin_id"],

            module=data["module"],

            action=data["action"],

            description=data["description"],

            ip_address=data.get("ip_address")

        )

        db.session.add(activity_log)

        db.session.commit()

        return activity_log, None

    except Exception:

        db.session.rollback()

        return None, "Failed to create activity log."


# ==========================================================
# Get All Activity Logs
# ==========================================================

def get_all_activity_logs():

    try:

        activity_logs = ActivityLog.query.order_by(

            ActivityLog.created_at.desc()

        ).all()

        return [

            activity_log.to_dict()

            for activity_log in activity_logs

        ], None

    except Exception:

        return None, "Failed to fetch activity logs."


# ==========================================================
# Get Activity Log By ID
# ==========================================================

def get_activity_log_by_id(activity_log_id):

    try:

        activity_log = ActivityLog.query.get(

            activity_log_id

        )

        if not activity_log:

            return None, "Activity log not found."

        return activity_log, None

    except Exception:

        return None, "Failed to fetch activity log."
# ==========================================================
# Get Activity Logs By Admin
# ==========================================================

def get_admin_activity_logs(admin_id):

    try:

        admin = Admin.query.get(admin_id)

        if not admin:

            return None, "Admin not found."

        activity_logs = ActivityLog.query.filter_by(

            admin_id=admin_id

        ).order_by(

            ActivityLog.created_at.desc()

        ).all()

        return [

            activity_log.to_dict()

            for activity_log in activity_logs

        ], None

    except Exception:

        return None, "Failed to fetch admin activity logs."


# ==========================================================
# Delete Activity Log
# ==========================================================

def delete_activity_log(activity_log_id):

    try:

        activity_log = ActivityLog.query.get(

            activity_log_id

        )

        if not activity_log:

            return None, "Activity log not found."

        db.session.delete(activity_log)

        db.session.commit()

        return True, None

    except Exception:

        db.session.rollback()

        return None, "Failed to delete activity log."


# ==========================================================
# Activity Log Statistics
# ==========================================================

def get_activity_log_statistics():

    try:

        total_logs = ActivityLog.query.count()

        total_admins = db.session.query(

            ActivityLog.admin_id

        ).distinct().count()

        return {

            "total_activity_logs": total_logs,

            "total_admins": total_admins

        }, None

    except Exception:

        return None, "Failed to fetch activity log statistics."