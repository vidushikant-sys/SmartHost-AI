"""
Fee Management Routes - Production Ready
RESTful API endpoints for fee and payment management.
"""

from flask import Blueprint, request, jsonify

from services.fee_service import (
    create_fee,
    get_all_fees,
    get_fee_by_id,
    update_fee,
    delete_fee,
    pay_fee,
    get_student_fee_history,
    get_pending_fees,
    get_paid_fees,
    get_monthly_fees,
    get_student_month_fee,
    get_hostel_fees,
    get_room_fees,
    get_overdue_fees,
    get_monthly_collection,
    get_fee_dashboard,
    add_payment,
    get_payment,
    get_all_payments,
    delete_payment,
    get_payment_history,
    get_student_payment_history
)

fee_bp = Blueprint("fee", __name__, url_prefix="/api")


# ============================================================
# Fee Creation & Management
# ============================================================

@fee_bp.route("/fees", methods=["POST"])
def create_fee_route():
    """Create a new monthly fee."""
    try:
        data = request.get_json()
        fee = create_fee(data)
        return jsonify({
            "success": True,
            "message": "Fee created successfully.",
            "data": fee
        }), 201
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/fees", methods=["GET"])
def get_all_fees_route():
    """Get all fees."""
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        fees = get_all_fees(hostel_id)
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/fees/<int:fee_id>", methods=["GET"])
def get_fee_by_id_route(fee_id):
    """Get a specific fee by ID."""
    try:
        fee = get_fee_by_id(fee_id)
        return jsonify({
            "success": True,
            "data": fee
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@fee_bp.route("/fees/<int:fee_id>", methods=["PUT"])
def update_fee_route(fee_id):
    """Update an existing fee."""
    try:
        data = request.get_json()
        fee = update_fee(fee_id, data)
        return jsonify({
            "success": True,
            "message": "Fee updated successfully.",
            "data": fee
        }), 200
    except ValueError as e:
        status_code = 404 if "not found" in str(e).lower() else 400
        return jsonify({
            "success": False,
            "message": str(e)
        }), status_code


@fee_bp.route("/fees/<int:fee_id>", methods=["DELETE"])
def delete_fee_route(fee_id):
    """Delete a fee."""
    try:
        delete_fee(fee_id)
        return jsonify({
            "success": True,
            "message": "Fee deleted successfully."
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


# ============================================================
# Student Fee Management
# ============================================================

@fee_bp.route("/fees/student/<int:student_id>", methods=["GET"])
def get_student_fee_history_route(student_id):
    """Get all fees for a student."""
    try:
        fees = get_student_fee_history(student_id)
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@fee_bp.route("/fees/student/<int:student_id>/<int:month>/<int:year>", methods=["GET"])
def get_student_month_fee_route(student_id, month, year):
    """Get a student's fee for a specific month and year."""
    try:
        fee = get_student_month_fee(student_id, month, year)
        return jsonify({
            "success": True,
            "data": fee
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


# ============================================================
# Property & Room Fee Management
# ============================================================

@fee_bp.route("/fees/hostel/<int:hostel_id>", methods=["GET"])
def get_hostel_fees_route(hostel_id):
    """Get all fees for a hostel."""
    try:
        fees = get_hostel_fees(hostel_id)
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@fee_bp.route("/fees/room/<int:room_id>", methods=["GET"])
def get_room_fees_route(room_id):
    """Get all fees for a room."""
    try:
        fees = get_room_fees(room_id)
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


# ============================================================
# Fee Status & Period Management
# ============================================================

@fee_bp.route("/fees/month/<int:month>/<int:year>", methods=["GET"])
def get_monthly_fees_route(month, year):
    """Get all fees for a specific month and year."""
    try:
        fees = get_monthly_fees(month, year)
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/fees/pending", methods=["GET"])
def get_pending_fees_route():
    """Get all pending fees (not fully paid)."""
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        fees = get_pending_fees(hostel_id)
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/fees/paid", methods=["GET"])
def get_paid_fees_route():
    """Get all fully paid fees."""
    try:
        fees = get_paid_fees()
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/fees/overdue", methods=["GET"])
def get_overdue_fees_route():
    """Get all overdue fees."""
    try:
        fees = get_overdue_fees()
        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


# ============================================================
# Fee Payment Processing
# ============================================================

@fee_bp.route("/fees/<int:fee_id>/pay", methods=["POST"])
def pay_fee_route(fee_id):
    """Process a fee payment (full or partial)."""
    try:
        data = request.get_json()
        result = pay_fee(fee_id, data)
        return jsonify({
            "success": True,
            "message": "Fee paid successfully.",
            "data": result
        }), 200
    except ValueError as e:
        status_code = 404 if "not found" in str(e).lower() else 400
        return jsonify({
            "success": False,
            "message": str(e)
        }), status_code


# ============================================================
# Payment Management
# ============================================================

@fee_bp.route("/payments", methods=["POST"])
def add_payment_route():
    """Add a payment to a fee."""
    try:
        data = request.get_json()
        payment = add_payment(data)
        return jsonify({
            "success": True,
            "message": "Payment added successfully.",
            "data": payment
        }), 201
    except ValueError as e:
        status_code = 404 if "not found" in str(e).lower() else 400
        return jsonify({
            "success": False,
            "message": str(e)
        }), status_code


@fee_bp.route("/payments", methods=["GET"])
def get_all_payments_route():
    """Get all payments with fee and student details."""
    try:
        result = get_all_payments()
        return jsonify({
            "success": True,
            "data": result
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/payments/<int:payment_id>", methods=["GET"])
def get_payment_route(payment_id):
    """Get a specific payment with fee and student details."""
    try:
        payment = get_payment(payment_id)
        return jsonify({
            "success": True,
            "data": payment
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@fee_bp.route("/payments/<int:payment_id>", methods=["DELETE"])
def delete_payment_route(payment_id):
    """Delete a payment and recalculate fee status."""
    try:
        result = delete_payment(payment_id)
        return jsonify({
            "success": True,
            "message": result["message"]
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


# ============================================================
# Payment History
# ============================================================

@fee_bp.route("/payments/history/<int:fee_id>", methods=["GET"])
def get_payment_history_route(fee_id):
    """Get payment history for a specific fee."""
    try:
        history = get_payment_history(fee_id)
        return jsonify({
            "success": True,
            "data": history
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


@fee_bp.route("/payments/student/<int:student_id>", methods=["GET"])
def get_student_payment_history_route(student_id):
    """Get payment history for all fees of a student."""
    try:
        history = get_student_payment_history(student_id)
        return jsonify({
            "success": True,
            "count": len(history),
            "data": history
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404


# ============================================================
# Reports & Dashboard
# ============================================================

@fee_bp.route("/fees/dashboard", methods=["GET"])
def get_fee_dashboard_route():
    """Get fee management dashboard statistics."""
    try:
        hostel_id = request.args.get("hostel_id", type=int)
        dashboard = get_fee_dashboard(hostel_id)
        return jsonify({
            "success": True,
            "data": dashboard
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@fee_bp.route("/fees/monthly-collection/<int:month>/<int:year>", methods=["GET"])
def get_monthly_collection_route(month, year):
    """Get monthly collection report for a specific month and year."""
    try:
        report = get_monthly_collection(month, year)
        return jsonify({
            "success": True,
            "data": report
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
