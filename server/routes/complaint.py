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
        complaint, error = create_complaint(data)

        if error:
            if isinstance(error, dict):
                return error_response("Validation failed", 400, error)
            return error_response(error, 400)

        # Defensive: make sure we always send a plain dict to jsonify,
        # even if create_complaint ever returns a raw model instance.
        if complaint is not None and hasattr(complaint, "to_dict"):
            complaint = complaint.to_dict()

        return success_response(
            "Complaint created successfully",
            complaint,
            201,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)


@complaint_bp.route("/all", methods=["GET"])
@jwt_required()
def all_complaints():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        complaints = get_all_complaints(hostel_id)
        complaints = [
            c.to_dict() if hasattr(c, "to_dict") else c
            for c in complaints
        ]
        return success_response(
            "Complaints fetched successfully",
            complaints,
            200,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)


@complaint_bp.route("/<int:complaint_id>", methods=["GET"])
@jwt_required()
def complaint_details(complaint_id):
    try:
        complaint = get_complaint_by_id(complaint_id)

        if complaint is None:
            return error_response("Complaint not found", 404)

        if hasattr(complaint, "to_dict"):
            complaint = complaint.to_dict()

        return success_response(
            "Complaint fetched successfully",
            complaint,
            200,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)


@complaint_bp.route("/student/<int:student_id>", methods=["GET"])
@jwt_required()
def student_complaints(student_id):
    try:
        complaints, error = get_student_complaints(student_id)

        if error:
            return error_response(error, 404)

        complaints = [
            c.to_dict() if hasattr(c, "to_dict") else c
            for c in complaints
        ]

        return success_response(
            "Student complaints fetched successfully",
            complaints,
            200,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)


@complaint_bp.route("/update/<int:complaint_id>", methods=["PUT"])
@jwt_required()
def edit_complaint(complaint_id):
    try:
        data = request.get_json()
        complaint, error = update_complaint(complaint_id, data)

        if error:
            if isinstance(error, dict):
                return error_response("Validation failed", 400, error)
            status_code = 404 if error == "Complaint not found" else 400
            return error_response(error, status_code)

        if complaint is not None and hasattr(complaint, "to_dict"):
            complaint = complaint.to_dict()

        return success_response(
            "Complaint updated successfully",
            complaint,
            200,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)


@complaint_bp.route("/delete/<int:complaint_id>", methods=["DELETE"])
@jwt_required()
def remove_complaint(complaint_id):
    try:
        deleted = delete_complaint(complaint_id)

        if not deleted:
            return error_response("Complaint not found", 404)

        return success_response(
            "Complaint deleted successfully",
            None,
            200,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)


@complaint_bp.route("/stats", methods=["GET"])
@jwt_required()
def complaint_statistics():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        stats = get_complaint_stats(hostel_id)
        return success_response(
            "Complaint statistics fetched successfully",
            stats,
            200,
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(f"Internal server error: {str(e)}", 500)