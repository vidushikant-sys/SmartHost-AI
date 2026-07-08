from flask import Blueprint

from flask_jwt_extended import jwt_required

from services.dashboard_service import (
    get_dashboard_data
)

from utils.response import (
    success_response,
    error_response
)



dashboard_bp = Blueprint(
    "dashboard",
    __name__
)



# ==================================================
# Admin Dashboard
# ==================================================

@dashboard_bp.route(
    "/",
    methods=["GET"]
)
@jwt_required()
def dashboard():


    try:

        data = get_dashboard_data()


        return success_response(
            "Dashboard data fetched successfully",
            data
        )


    except Exception as e:


        return error_response(
            "Internal server error",
            500
        )