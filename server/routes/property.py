from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.property_service import (
    create_property,
    get_all_properties,
    get_property_by_id,
    update_property,
    delete_property
)

from utils.response import success_response, error_response

property_bp = Blueprint("property", __name__)


# ==========================================
# Add Hostel
# ==========================================
@property_bp.route("/add", methods=["POST"])
@jwt_required()
def add_property():

    data = request.get_json()
    owner_id = get_jwt_identity()

    property_obj = create_property(data, owner_id)

    return success_response(
        "Hostel Added Successfully",
        {
            "hostel_id": property_obj.id
        },
        201
    )


# ==========================================
# Get All Hostels
# ==========================================
@property_bp.route("/all", methods=["GET"])
def all_properties():

    properties = get_all_properties()

    return success_response(
        "Hostels fetched successfully",
        properties
    )


# ==========================================
# Get Hostel By ID
# ==========================================
@property_bp.route("/<int:property_id>", methods=["GET"])
def property_details(property_id):

    property_obj = get_property_by_id(property_id)

    if property_obj is None:
        return error_response(
            "Hostel not found",
            404
        )

    return success_response(
        "Hostel fetched successfully",
        property_obj
    )


# ==========================================
# Update Hostel
# ==========================================
@property_bp.route("/update/<int:property_id>", methods=["PUT"])
@jwt_required()
def update_property_route(property_id):

    data = request.get_json()
    owner_id = get_jwt_identity()

    property_obj = update_property(
        property_id,
        data,
        owner_id
    )

    if property_obj is None:
        return error_response(
            "Hostel not found",
            404
        )

    if property_obj is False:
        return error_response(
            "You are not authorized to update this hostel",
            403
        )

    return success_response(
        "Hostel Updated Successfully",
        property_obj.to_dict()
    )


# ==========================================
# Delete Hostel
# ==========================================
@property_bp.route("/delete/<int:property_id>", methods=["DELETE"])
@jwt_required()
def delete_property_route(property_id):

    owner_id = get_jwt_identity()

    result = delete_property(
        property_id,
        owner_id
    )

    if result is None:
        return error_response(
            "Hostel not found",
            404
        )

    if result is False:
        return error_response(
            "You are not authorized to delete this hostel",
            403
        )

    return success_response(
        "Hostel Deleted Successfully"
    )