from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.room_service import (
    create_room,
    get_all_rooms,
    get_room_by_id,
    update_room,
    delete_room
)

from utils.response import success_response, error_response


room_bp = Blueprint("room", __name__)


# ==================================================
# Add Room
# ==================================================
@room_bp.route("/add", methods=["POST"])
@jwt_required()
def add_room():

    data = request.get_json()

    room, error = create_room(data)

    if error:

        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        return error_response(error, 400)

    return success_response(
        "Room Added Successfully",
        {
            "room_id": room.id
        },
        201
    )


# ==================================================
# Get All Rooms
# ==================================================
@room_bp.route("/all", methods=["GET"])
def all_rooms():

    hostel_id = request.args.get("hostel_id", type=int)

    rooms = get_all_rooms(hostel_id)

    return success_response(
        "Rooms fetched successfully",
        rooms
    )


# ==================================================
# Get Room By ID
# ==================================================
@room_bp.route("/<int:room_id>", methods=["GET"])
def room_details(room_id):

    room = get_room_by_id(room_id)

    if room is None:
        return error_response(
            "Room not found",
            404
        )

    return success_response(
        "Room fetched successfully",
        room
    )


# ==================================================
# Update Room
# ==================================================
@room_bp.route("/update/<int:room_id>", methods=["PUT"])
@jwt_required()
def update_room_details(room_id):

    data = request.get_json()

    room, error = update_room(room_id, data)

    if error:

        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        if error == "Room not found":
            return error_response(
                error,
                404
            )

        return error_response(
            error,
            400
        )

    return success_response(
        "Room Updated Successfully",
        room.to_dict()
    )

# ==================================================
# Delete Room
# ==================================================
@room_bp.route("/delete/<int:room_id>", methods=["DELETE"])
@jwt_required()
def delete_room_details(room_id):

    deleted, error = delete_room(room_id)

    if not deleted:
        return error_response(
            error or "Room not found",
            404 if error == "Room not found" else 400
        )

    return success_response(
        "Room Deleted Successfully"
    )