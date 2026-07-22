from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.report_service import (
    get_overview_report,
    get_revenue_trend,
    get_student_growth,
    get_hostel_performance,
    get_complaint_insights,
)

from utils.response import (
    success_response,
    error_response
)


reports_bp = Blueprint(
    "reports",
    __name__
)


# ==================================================
# Overview
# ==================================================

@reports_bp.route("/overview", methods=["GET"])
@jwt_required()
def overview():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        data = get_overview_report(hostel_id)
        return success_response("Overview report fetched successfully", data)
    except Exception:
        return error_response("Internal server error", 500)


# ==================================================
# Revenue Trend
# ==================================================

@reports_bp.route("/revenue-trend", methods=["GET"])
@jwt_required()
def revenue_trend():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        months = request.args.get("months", default=6, type=int)
        data = get_revenue_trend(hostel_id, months)
        return success_response("Revenue trend fetched successfully", data)
    except Exception:
        return error_response("Internal server error", 500)


# ==================================================
# Student Growth
# ==================================================

@reports_bp.route("/student-growth", methods=["GET"])
@jwt_required()
def student_growth():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        months = request.args.get("months", default=6, type=int)
        data = get_student_growth(hostel_id, months)
        return success_response("Student growth fetched successfully", data)
    except Exception:
        return error_response("Internal server error", 500)


# ==================================================
# Hostel Performance
# ==================================================

@reports_bp.route("/hostel-performance", methods=["GET"])
@jwt_required()
def hostel_performance():
    try:
        data = get_hostel_performance()
        return success_response("Hostel performance fetched successfully", data)
    except Exception:
        return error_response("Internal server error", 500)


# ==================================================
# Complaint Insights
# ==================================================

@reports_bp.route("/complaint-insights", methods=["GET"])
@jwt_required()
def complaint_insights():
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        data = get_complaint_insights(hostel_id)
        return success_response("Complaint insights fetched successfully", data)
    except Exception:
        return error_response("Internal server error", 500)