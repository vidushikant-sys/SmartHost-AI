from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.complaint_service import (
    create_complaint,
    get_all_complaints,
    get_complaint_by_id,
    get_student_complaints,
    update_complaint,
    delete_complaint,
    get_complaint_stats
)

from utils.response import (
    success_response,
    error_response
)


complaint_bp = Blueprint(
    "complaint",
    __name__
)



# ==================================================
# Add Complaint
# ==================================================

@complaint_bp.route(
    "/add",
    methods=["POST"]
)
@jwt_required()
def add_complaint():

    data = request.get_json()


    if not data:

        return error_response(
            "Request body required",
            400
        )


    required_fields = [
        "student_id",
        "title",
        "description"
    ]


    for field in required_fields:

        if field not in data:

            return error_response(
                f"{field} is required",
                400
            )



    complaint = create_complaint(
        data
    )


    return success_response(
        "Complaint created successfully",
        {
            "complaint_id": complaint.id
        },
        201
    )



# ==================================================
# Get All Complaints
# ==================================================

@complaint_bp.route(
    "/all",
    methods=["GET"]
)
@jwt_required()
def all_complaints():


    complaints = get_all_complaints()


    return success_response(
        "Complaints fetched successfully",
        complaints
    )



# ==================================================
# Get Complaint By ID
# ==================================================

@complaint_bp.route(
    "/<int:complaint_id>",
    methods=["GET"]
)
@jwt_required()
def complaint_details(
    complaint_id
):


    complaint = get_complaint_by_id(
        complaint_id
    )


    if not complaint:

        return error_response(
            "Complaint not found",
            404
        )


    return success_response(
        "Complaint fetched successfully",
        complaint.to_dict()
    )



# ==================================================
# Get Student Complaints
# ==================================================

@complaint_bp.route(
    "/student/<int:student_id>",
    methods=["GET"]
)
@jwt_required()
def student_complaints(
    student_id
):


    complaints = get_student_complaints(
        student_id
    )


    return success_response(
        "Student complaints fetched successfully",
        complaints
    )



# ==================================================
# Update Complaint
# ==================================================

@complaint_bp.route(
    "/update/<int:complaint_id>",
    methods=["PUT"]
)
@jwt_required()
def edit_complaint(
    complaint_id
):

    data = request.get_json()


    complaint = update_complaint(
        complaint_id,
        data
    )


    if not complaint:

        return error_response(
            "Complaint not found",
            404
        )



    return success_response(
        "Complaint updated successfully",
        complaint.to_dict()
    )



# ==================================================
# Delete Complaint
# ==================================================

@complaint_bp.route(
    "/delete/<int:complaint_id>",
    methods=["DELETE"]
)
@jwt_required()
def remove_complaint(
    complaint_id
):


    result = delete_complaint(
        complaint_id
    )


    if not result:

        return error_response(
            "Complaint not found",
            404
        )


    return success_response(
        "Complaint deleted successfully",
        {}
    )



# ==================================================
# Complaint Statistics
# ==================================================

@complaint_bp.route(
    "/stats",
    methods=["GET"]
)
@jwt_required()
def complaint_statistics():


    stats = get_complaint_stats()


    return success_response(
        "Complaint statistics fetched successfully",
        stats
    )