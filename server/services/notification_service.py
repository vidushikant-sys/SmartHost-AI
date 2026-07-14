from config.extensions import db

from models.notification import Notification
from models.student import Student

from validators.notification_validator import (
    NotificationValidator
)


# ==========================================================
# Create Notification
# ==========================================================

def create_notification(data):

    is_valid, errors = NotificationValidator.validate(data)

    if not is_valid:
        return None, errors

    try:

        notification = Notification(

            student_id=data["student_id"],

            title=data["title"].strip(),

            message=data["message"].strip(),

            type=data.get(
                "type",
                "General"
            ),

            is_read=False

        )

        db.session.add(notification)

        db.session.commit()

        return notification, None

    except Exception:

        db.session.rollback()

        return None, "Failed to create notification."


# ==========================================================
# Get All Notifications
# ==========================================================

def get_all_notifications():

    try:

        notifications = Notification.query.order_by(
            Notification.created_at.desc()
        ).all()

        return (
            [
                notification.to_dict()
                for notification in notifications
            ],
            None
        )

    except Exception:

        return None, "Failed to fetch notifications."


# ==========================================================
# Get Notification By ID
# ==========================================================

def get_notification_by_id(notification_id):

    try:

        notification = Notification.query.get(
            notification_id
        )

        if not notification:

            return None, "Notification not found."

        return notification, None

    except Exception:

        return None, "Failed to fetch notification."
# ==========================================================
# Get Student Notifications
# ==========================================================

def get_student_notifications(student_id):

    try:

        student = Student.query.get(student_id)

        if not student:

            return None, "Student not found."

        notifications = Notification.query.filter_by(
            student_id=student_id
        ).order_by(
            Notification.created_at.desc()
        ).all()

        return (
            [
                notification.to_dict()
                for notification in notifications
            ],
            None
        )

    except Exception:

        return None, "Failed to fetch student notifications."


# ==========================================================
# Mark Notification As Read
# ==========================================================

def mark_notification_as_read(notification_id):

    try:

        notification = Notification.query.get(
            notification_id
        )

        if not notification:

            return None, "Notification not found."

        notification.is_read = True

        db.session.commit()

        return notification, None

    except Exception:

        db.session.rollback()

        return None, "Failed to update notification."


# ==========================================================
# Mark All Notifications As Read
# ==========================================================

def mark_all_notifications_as_read(student_id):

    try:

        student = Student.query.get(student_id)

        if not student:

            return None, "Student not found."

        notifications = Notification.query.filter_by(
            student_id=student_id,
            is_read=False
        ).all()

        for notification in notifications:

            notification.is_read = True

        db.session.commit()

        return len(notifications), None

    except Exception:

        db.session.rollback()

        return None, "Failed to mark notifications as read."
# ==========================================================
# Delete Notification
# ==========================================================

def delete_notification(notification_id):

    try:

        notification = Notification.query.get(
            notification_id
        )

        if not notification:

            return None, "Notification not found."

        db.session.delete(notification)

        db.session.commit()

        return True, None

    except Exception:

        db.session.rollback()

        return None, "Failed to delete notification."


# ==========================================================
# Get Unread Notification Count
# ==========================================================

def get_unread_notification_count(student_id):

    try:

        student = Student.query.get(student_id)

        if not student:

            return None, "Student not found."

        unread_count = Notification.query.filter_by(

            student_id=student_id,

            is_read=False

        ).count()

        return unread_count, None

    except Exception:

        return None, "Failed to fetch unread notification count."


# ==========================================================
# Notification Dashboard Statistics
# ==========================================================

def get_notification_statistics():

    try:

        total_notifications = Notification.query.count()

        unread_notifications = Notification.query.filter_by(

            is_read=False

        ).count()

        read_notifications = Notification.query.filter_by(

            is_read=True

        ).count()

        fee_notifications = Notification.query.filter_by(

            type="Fee"

        ).count()

        complaint_notifications = Notification.query.filter_by(

            type="Complaint"

        ).count()

        notice_notifications = Notification.query.filter_by(

            type="Notice"

        ).count()

        allocation_notifications = Notification.query.filter_by(

            type="Allocation"

        ).count()

        general_notifications = Notification.query.filter_by(

            type="General"

        ).count()

        statistics = {

            "total_notifications": total_notifications,

            "read_notifications": read_notifications,

            "unread_notifications": unread_notifications,

            "fee_notifications": fee_notifications,

            "complaint_notifications": complaint_notifications,

            "notice_notifications": notice_notifications,

            "allocation_notifications": allocation_notifications,

            "general_notifications": general_notifications

        }

        return statistics, None

    except Exception:

        return None, "Failed to fetch notification statistics."