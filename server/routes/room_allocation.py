from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.room_allocation_service import (
    allocate_room,
    get_all_allocations,
    get_student_allocation,
    get_room_allocations,
    transfer_room,
    vacate_room
)

from utils.response import (
    success_response,
    error_response
)


allocation_bp = Blueprint(
    "allocation",
    __name__
)


# =====================================================
# Allocate Room
# =====================================================

@allocation_bp.route("/allocate", methods=["POST"])
@jwt_required()
def allocate():

    data = request.get_json()

    allocation, error = allocate_room(data)

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
        "Room Allocated Successfully",
        {
            "allocation_id": allocation.id
        },
        201
    )


# =====================================================
# Get All Allocations
# =====================================================

@allocation_bp.route("/all", methods=["GET"])
@jwt_required()
def all_allocations():

    allocations = get_all_allocations()

    return success_response(
        "Allocations fetched successfully",
        allocations
    )


# =====================================================
# Get Allocation By Student
# =====================================================

@allocation_bp.route("/student/<int:student_id>", methods=["GET"])
@jwt_required()
def allocation_by_student(student_id):

    allocation = get_student_allocation(student_id)

    if allocation is None:

        return error_response(
            "No active allocation found",
            404
        )

    return success_response(
        "Allocation fetched successfully",
        allocation
    )


# =====================================================
# Get Allocations By Room
# =====================================================

@allocation_bp.route("/room/<int:room_id>", methods=["GET"])
@jwt_required()
def allocation_by_room(room_id):

    allocations = get_room_allocations(room_id)

    return success_response(
        "Room allocations fetched successfully",
        allocations
    )
    # =====================================================
# Transfer Room
# =====================================================

@allocation_bp.route("/transfer/<int:student_id>", methods=["PUT"])
@jwt_required()
def transfer(student_id):

    data = request.get_json()

    allocation, error = transfer_room(student_id, data)

    if error:
        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        if error in [
            "Student has no active room",
            "Room not found"
        ]:
            return error_response(
                error,
                404
            )

        return error_response(
            error,
            400
        )

    return success_response(
        "Room transferred successfully",
        {
            "allocation_id": allocation.id
        }
    )


# =====================================================
# Vacate Room
# =====================================================

@allocation_bp.route("/vacate/<int:student_id>", methods=["PUT"])
@jwt_required()
def vacate(student_id):

    data = request.get_json()

    allocation, error = vacate_room(student_id, data)

    if error:
        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        if error in [
            "Student has no active room",
            "Room not found"
        ]:
            return error_response(
                error,
                404
            )

        return error_response(
            error,
            400
        )

    return success_response(
        "Room vacated successfully",
        {
            "allocation_id": allocation.id,
            "status": allocation.allocation_status
        }
    )