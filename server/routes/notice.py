from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.notice_service import (
    create_notice,
    get_all_notices,
    get_notice_by_id,
    update_notice,
    delete_notice,
    get_notice_stats
)

from utils.response import (
    success_response,
    error_response
)


notice_bp = Blueprint(
    "notice",
    __name__
)


# ==================================================
# Add Notice
# ==================================================

@notice_bp.route(
    "/add",
    methods=["POST"]
)
@jwt_required()
def add_notice():
    data = request.get_json()

    notice, error = create_notice(data)

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
        "Notice created successfully",
        {
            "notice_id": notice.id
        },
        201
    )


# ==================================================
# Get All Notices
# ==================================================

@notice_bp.route(
    "/all",
    methods=["GET"]
)
@jwt_required()
def all_notices():
    hostel_id = request.args.get(
        "hostel_id",
        type=int
    )

    notices = get_all_notices(hostel_id)

    return success_response(
        "Notices fetched successfully",
        notices
    )


# ==================================================
# Get Notice By ID
# ==================================================

@notice_bp.route(
    "/<int:notice_id>",
    methods=["GET"]
)
@jwt_required()
def notice_details(
    notice_id
):
    notice = get_notice_by_id(
        notice_id
    )

    if not notice:
        return error_response(
            "Notice not found",
            404
        )

    return success_response(
        "Notice fetched successfully",
        notice.to_dict()
    )


# ==================================================
# Update Notice
# ==================================================

@notice_bp.route(
    "/update/<int:notice_id>",
    methods=["PUT"]
)
@jwt_required()
def edit_notice(
    notice_id
):
    data = request.get_json()

    notice, error = update_notice(
        notice_id,
        data
    )

    if error:
        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        if error == "Notice not found":
            return error_response(
                error,
                404
            )

        return error_response(
            error,
            400
        )

    return success_response(
        "Notice updated successfully",
        notice.to_dict()
    )


# ==================================================
# Delete Notice
# ==================================================

@notice_bp.route(
    "/delete/<int:notice_id>",
    methods=["DELETE"]
)
@jwt_required()
def remove_notice(
    notice_id
):
    result = delete_notice(
        notice_id
    )

    if not result:
        return error_response(
            "Notice not found",
            404
        )

    return success_response(
        "Notice deleted successfully",
        {}
    )


# ==================================================
# Notice Statistics
# ==================================================

@notice_bp.route(
    "/stats",
    methods=["GET"]
)
@jwt_required()
def notice_statistics():
    stats = get_notice_stats()

    return success_response(
        "Notice statistics fetched successfully",
        stats
    )
