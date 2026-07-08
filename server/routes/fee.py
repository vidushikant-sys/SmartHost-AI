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

fee_bp = Blueprint(
    "fee",
    __name__,
    url_prefix="/api"
)


# ============================================================
# Create Fee
# ============================================================

@fee_bp.route("/fees", methods=["POST"])
def create_fee_route():

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

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Get All Fees
# ============================================================

@fee_bp.route("/fees", methods=["GET"])
def get_all_fees_route():

    try:

        fees = get_all_fees()

        return jsonify({
            "success": True,
            "count": len(fees),
            "data": fees
        }), 200

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
        # ============================================================
# Get Fee By ID
# ============================================================

@fee_bp.route("/fees/<int:fee_id>", methods=["GET"])
def get_fee_by_id_route(fee_id):

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

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Update Fee
# ============================================================

@fee_bp.route("/fees/<int:fee_id>", methods=["PUT"])
def update_fee_route(fee_id):

    try:

        data = request.get_json()

        fee = update_fee(
            fee_id,
            data
        )

        return jsonify({
            "success": True,
            "message": "Fee updated successfully.",
            "data": fee
        }), 200

    except ValueError as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Delete Fee
# ============================================================

@fee_bp.route("/fees/<int:fee_id>", methods=["DELETE"])
def delete_fee_route(fee_id):

    try:

        result = delete_fee(fee_id)

        return jsonify({
            "success": True,
            "message": result["message"]
        }), 200

    except ValueError as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
        # ============================================================
# Get Student Fee History
# ============================================================

@fee_bp.route("/fees/student/<int:student_id>", methods=["GET"])
def get_student_fee_history_route(student_id):

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

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Get Student Fee By Month
# ============================================================

@fee_bp.route(
    "/fees/student/<int:student_id>/<int:month>/<int:year>",
    methods=["GET"]
)
def get_student_month_fee_route(student_id, month, year):

    try:

        fee = get_student_month_fee(
            student_id,
            month,
            year
        )

        return jsonify({
            "success": True,
            "data": fee
        }), 200

    except ValueError as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Get Hostel Fees
# ============================================================

@fee_bp.route("/fees/hostel/<int:hostel_id>", methods=["GET"])
def get_hostel_fees_route(hostel_id):

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

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Get Room Fees
# ============================================================

@fee_bp.route("/fees/room/<int:room_id>", methods=["GET"])
def get_room_fees_route(room_id):

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

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500


# ============================================================
# Get Monthly Fees
# ============================================================

@fee_bp.route("/fees/month/<int:month>/<int:year>", methods=["GET"])
def get_monthly_fees_route(month, year):

    try:

        fees = get_monthly_fees(
            month,
            year
        )

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

    except Exception:

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
        # ============================================================
# Pay Fee
# ============================================================

@fee_bp.route("/fees/<int:fee_id>/pay", methods=["POST"])
def pay_fee_route(fee_id):

    try:

        data = request.get_json()

        payment = pay_fee(
            fee_id,
            data
        )

        return jsonify({

            "success": True,

            "message": "Fee paid successfully.",

            "data": payment

        }), 201

    except ValueError as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 400

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Add Payment
# ============================================================

@fee_bp.route("/payments", methods=["POST"])
def add_payment_route():

    try:

        data = request.get_json()

        payment = add_payment(data)

        return jsonify({

            "success": True,

            "message": "Payment added successfully.",

            "data": payment

        }), 201

    except ValueError as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 400

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Get All Payments
# ============================================================

@fee_bp.route("/payments", methods=["GET"])
def get_all_payments_route():

    try:

        payments = get_all_payments()

        return jsonify({

            "success": True,

            "data": payments

        }), 200

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Get Payment By ID
# ============================================================

@fee_bp.route("/payments/<int:payment_id>", methods=["GET"])
def get_payment_route(payment_id):

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

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Delete Payment
# ============================================================

@fee_bp.route("/payments/<int:payment_id>", methods=["DELETE"])
def delete_payment_route(payment_id):

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

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500
        # ============================================================
# Get Payment History By Fee
# ============================================================

@fee_bp.route("/payments/history/<int:fee_id>", methods=["GET"])
def get_payment_history_route(fee_id):

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

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Get Student Payment History
# ============================================================

@fee_bp.route("/payments/student/<int:student_id>", methods=["GET"])
def get_student_payment_history_route(student_id):

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

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Get Pending Fees
# ============================================================

@fee_bp.route("/fees/pending", methods=["GET"])
def get_pending_fees_route():

    try:

        fees = get_pending_fees()

        return jsonify({

            "success": True,

            "count": len(fees),

            "data": fees

        }), 200

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Get Paid Fees
# ============================================================

@fee_bp.route("/fees/paid", methods=["GET"])
def get_paid_fees_route():

    try:

        fees = get_paid_fees()

        return jsonify({

            "success": True,

            "count": len(fees),

            "data": fees

        }), 200

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Get Overdue Fees
# ============================================================

@fee_bp.route("/fees/overdue", methods=["GET"])
def get_overdue_fees_route():

    try:

        fees = get_overdue_fees()

        return jsonify({

            "success": True,

            "count": len(fees),

            "data": fees

        }), 200

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Fee Dashboard
# ============================================================

@fee_bp.route("/fees/dashboard", methods=["GET"])
def get_fee_dashboard_route():

    try:

        dashboard = get_fee_dashboard()

        return jsonify({

            "success": True,

            "data": dashboard

        }), 200

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500


# ============================================================
# Monthly Collection Report
# ============================================================

@fee_bp.route(
    "/fees/monthly-collection/<int:month>/<int:year>",
    methods=["GET"]
)
def get_monthly_collection_route(month, year):

    try:

        report = get_monthly_collection(
            month,
            year
        )

        return jsonify({

            "success": True,

            "data": report

        }), 200

    except ValueError as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 404

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500