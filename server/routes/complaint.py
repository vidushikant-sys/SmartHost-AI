from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.complaint_service import (
    create_complaint,
    get_all_complaints,
    get_complaint_by_id,
    get_student_complaints,
    update_complaint,
    delete_complaint,
    get_complaint_stats,
)
from utils.response import error_response, success_response


complaint_bp = Blueprint("complaint", __name__)


@complaint_bp.route("/add", methods=["POST"])
@jwt_required()
def add_complaint():
    try:
        data = request.get_json()
        complaint = create_complaint(data)
        return success_response(
            "Complaint created successfully",
            complaint,
            201,
        )

    except ValueError as error:
        return error_response(str(error), 400)

    except Exception:
        return error_response("Internal server error.", 500)


@complaint_bp.route("/all", methods=["GET"])
@jwt_required()
def all_complaints():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        complaints = get_all_complaints(hostel_id)
        return success_response(
            "Complaints fetched successfully",
            complaints,
            200,
        )

    except Exception:
        return error_response("Internal server error.", 500)


@complaint_bp.route("/<int:complaint_id>", methods=["GET"])
@jwt_required()
def complaint_details(complaint_id):
    try:
        complaint = get_complaint_by_id(complaint_id)
        return success_response(
            "Complaint fetched successfully",
            complaint,
            200,
        )

    except ValueError as error:
        return error_response(str(error), 404)

    except Exception:
        return error_response("Internal server error.", 500)


@complaint_bp.route("/student/<int:student_id>", methods=["GET"])
@jwt_required()
def student_complaints(student_id):
    try:
        complaints = get_student_complaints(student_id)
        return success_response(
            "Student complaints fetched successfully",
            complaints,
            200,
        )

    except ValueError as error:
        return error_response(str(error), 404)

    except Exception:
        return error_response("Internal server error.", 500)


@complaint_bp.route("/update/<int:complaint_id>", methods=["PUT"])
@jwt_required()
def edit_complaint(complaint_id):
    try:
        data = request.get_json()
        complaint = update_complaint(complaint_id, data)
        return success_response(
            "Complaint updated successfully",
            complaint,
            200,
        )

    except ValueError as error:
        message = str(error)
        status_code = 404 if message == "Complaint not found." else 400
        return error_response(message, status_code)

    except Exception:
        return error_response("Internal server error.", 500)


@complaint_bp.route("/delete/<int:complaint_id>", methods=["DELETE"])
@jwt_required()
def remove_complaint(complaint_id):
    try:
        result = delete_complaint(complaint_id)
        return success_response(
            "Complaint deleted successfully",
            result,
            200,
        )

    except ValueError as error:
        return error_response(str(error), 404)

    except Exception:
        return error_response("Internal server error.", 500)


@complaint_bp.route("/stats", methods=["GET"])
@jwt_required()
def complaint_statistics():
    try:
        stats = get_complaint_stats()
        return success_response(
            "Complaint statistics fetched successfully",
            stats,
            200,
        )

    except Exception:
        return error_response("Internal server error.", 500)
