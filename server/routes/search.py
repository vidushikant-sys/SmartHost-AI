from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.search_service import (
    search_students,
    search_rooms,
    search_hostels,
    search_fees,
    search_complaints
)

from utils.response import (
    success_response,
    error_response
)


search_bp = Blueprint(
    "search",
    __name__
)


# ==================================================
# Student Search
# ==================================================

@search_bp.route(
    "/students",
    methods=["GET"]
)
@jwt_required()
def student_search():

    try:

        filters = request.args.to_dict()

        students = search_students(
            filters
        )

        return success_response(
            "Students searched successfully",
            students
        )


    except Exception as e:

        print("STUDENT SEARCH ERROR:", e)

        return error_response(
            "Internal server error",
            500
        )



# ==================================================
# Room Search
# ==================================================

@search_bp.route(
    "/rooms",
    methods=["GET"]
)
@jwt_required()
def room_search():

    try:

        filters = request.args.to_dict()

        rooms = search_rooms(
            filters
        )

        return success_response(
            "Rooms searched successfully",
            rooms
        )


    except Exception as e:

        print("ROOM SEARCH ERROR:", e)

        return error_response(
            "Internal server error",
            500
        )



# ==================================================
# Hostel Search
# ==================================================

@search_bp.route(
    "/hostels",
    methods=["GET"]
)
@jwt_required()
def hostel_search():

    try:

        filters = request.args.to_dict()

        hostels = search_hostels(
            filters
        )

        return success_response(
            "Hostels searched successfully",
            hostels
        )


    except Exception as e:

        print("HOSTEL SEARCH ERROR:", e)

        return error_response(
            "Internal server error",
            500
        )



# ==================================================
# Fee Search
# ==================================================

@search_bp.route(
    "/fees",
    methods=["GET"]
)
@jwt_required()
def fee_search():

    try:

        filters = request.args.to_dict()

        fees = search_fees(
            filters
        )

        return success_response(
            "Fees searched successfully",
            fees
        )


    except Exception as e:

        print("FEE SEARCH ERROR:", e)

        return error_response(
            "Internal server error",
            500
        )



# ==================================================
# Complaint Search
# ==================================================

@search_bp.route(
    "/complaints",
    methods=["GET"]
)
@jwt_required()
def complaint_search():

    try:

        filters = request.args.to_dict()

        complaints = search_complaints(
            filters
        )

        return success_response(
            "Complaints searched successfully",
            complaints
        )


    except Exception as e:

        print("COMPLAINT SEARCH ERROR:", e)

        return error_response(
            "Internal server error",
            500
        )