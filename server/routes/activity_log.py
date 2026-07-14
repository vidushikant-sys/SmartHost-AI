from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.activity_log_service import (

    create_activity_log,

    get_all_activity_logs,

    get_activity_log_by_id,

    get_admin_activity_logs,

    delete_activity_log,

    get_activity_log_statistics

)

from utils.response import (

    success_response,

    error_response

)


activity_log_bp = Blueprint(

    "activity_log",

    __name__

)


# ==================================================
# Add Activity Log
# ==================================================

@activity_log_bp.route(

    "/add",

    methods=["POST"]

)
@jwt_required()
def add_activity_log():

    data = request.get_json()

    activity_log, error = create_activity_log(data)

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

        "Activity log created successfully",

        {

            "activity_log_id": activity_log.id

        },

        201

    )


# ==================================================
# Get All Activity Logs
# ==================================================

@activity_log_bp.route(

    "/all",

    methods=["GET"]

)
@jwt_required()
def all_activity_logs():

    activity_logs, error = get_all_activity_logs()

    if error:

        return error_response(

            error,

            400

        )

    return success_response(

        "Activity logs fetched successfully",

        activity_logs

    )


# ==================================================
# Get Activity Log By ID
# ==================================================

@activity_log_bp.route(

    "/<int:activity_log_id>",

    methods=["GET"]

)
@jwt_required()
def activity_log_details(

    activity_log_id

):

    activity_log, error = get_activity_log_by_id(

        activity_log_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Activity log fetched successfully",

        activity_log.to_dict()

    )
# ==================================================
# Get Activity Logs By Admin
# ==================================================

@activity_log_bp.route(

    "/admin/<int:admin_id>",

    methods=["GET"]

)
@jwt_required()
def admin_activity_logs(

    admin_id

):

    activity_logs, error = get_admin_activity_logs(

        admin_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Admin activity logs fetched successfully",

        activity_logs

    )


# ==================================================
# Delete Activity Log
# ==================================================

@activity_log_bp.route(

    "/delete/<int:activity_log_id>",

    methods=["DELETE"]

)
@jwt_required()
def remove_activity_log(

    activity_log_id

):

    result, error = delete_activity_log(

        activity_log_id

    )

    if error:

        return error_response(

            error,

            404

        )

    return success_response(

        "Activity log deleted successfully",

        {}

    )


# ==================================================
# Activity Log Statistics
# ==================================================

@activity_log_bp.route(

    "/stats",

    methods=["GET"]

)
@jwt_required()
def activity_log_statistics():

    statistics, error = get_activity_log_statistics()

    if error:

        return error_response(

            error,

            400

        )

    return success_response(

        "Activity log statistics fetched successfully",

        statistics

    )