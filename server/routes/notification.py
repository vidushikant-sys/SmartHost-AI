from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.notification_service import (

    create_notification,

    get_all_notifications,

    get_notification_by_id,

    get_student_notifications,

    mark_notification_as_read,

    mark_all_notifications_as_read,

    delete_notification,

    get_unread_notification_count,

    get_notification_statistics

)

from utils.response import (

    success_response,

    error_response

)


notification_bp = Blueprint(

    "notification",

    __name__

)


# ==================================================
# Add Notification
# ==================================================

@notification_bp.route(

    "/add",

    methods=["POST"]

)
@jwt_required()
def add_notification():

    data = request.get_json()

    notification, error = create_notification(data)

    if error:

        if isinstance(error, dict):

            return error_response(

                "Validation failed",

                400,

                error

            )

        return error_response(

            error,

            400

        )

    return success_response(

        "Notification created successfully",

        {

            "notification_id": notification.id

        },

        201

    )


# ==================================================
# Get All Notifications
# ==================================================

@notification_bp.route(

    "/all",

    methods=["GET"]

)
@jwt_required()
def all_notifications():

    notifications, error = get_all_notifications()

    if error:

        return error_response(

            error,

            400

        )

    return success_response(

        "Notifications fetched successfully",

        notifications

    )


# ==================================================
# Get Notification By ID
# ==================================================

@notification_bp.route(

    "/<int:notification_id>",

    methods=["GET"]

)
@jwt_required()
def notification_details(

    notification_id

):

    notification, error = get_notification_by_id(

        notification_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Notification fetched successfully",

        notification.to_dict()

    )


# ==================================================
# Get Student Notifications
# ==================================================

@notification_bp.route(

    "/student/<int:student_id>",

    methods=["GET"]

)
@jwt_required()
def student_notifications(

    student_id

):

    notifications, error = get_student_notifications(

        student_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Student notifications fetched successfully",

        notifications

    )
# ==================================================
# Mark Notification As Read
# ==================================================

@notification_bp.route(

    "/read/<int:notification_id>",

    methods=["PUT"]

)
@jwt_required()
def read_notification(

    notification_id

):

    notification, error = mark_notification_as_read(

        notification_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Notification marked as read",

        notification.to_dict()

    )


# ==================================================
# Mark All Notifications As Read
# ==================================================

@notification_bp.route(

    "/read-all/<int:student_id>",

    methods=["PUT"]

)
@jwt_required()
def read_all_notifications(

    student_id

):

    count, error = mark_all_notifications_as_read(

        student_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "All notifications marked as read",

        {

            "updated_notifications": count

        }

    )


# ==================================================
# Delete Notification
# ==================================================

@notification_bp.route(

    "/delete/<int:notification_id>",

    methods=["DELETE"]

)
@jwt_required()
def remove_notification(

    notification_id

):

    result, error = delete_notification(

        notification_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Notification deleted successfully",

        {}

    )


# ==================================================
# Get Unread Notification Count
# ==================================================

@notification_bp.route(

    "/unread-count/<int:student_id>",

    methods=["GET"]

)
@jwt_required()
def unread_notification_count(

    student_id

):

    count, error = get_unread_notification_count(

        student_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Unread notification count fetched successfully",

        {

            "unread_count": count

        }

    )


# ==================================================
# Notification Statistics
# ==================================================

@notification_bp.route(

    "/stats",

    methods=["GET"]

)
@jwt_required()
def notification_statistics():

    statistics, error = get_notification_statistics()

    if error:

        return error_response(

            error,

            400

        )

    return success_response(

        "Notification statistics fetched successfully",

        statistics

    )