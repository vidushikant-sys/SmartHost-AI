from datetime import date, datetime

from sqlalchemy import extract, func

from config.extensions import db

from models.fee import Fee
from models.fee_payment import FeePayment
from models.student import Student
from models.room import Room
from models.property import Property


# ============================================================
# Create Monthly Fee
# ============================================================

def create_fee(data):

    student_id = data.get("student_id")
    hostel_id = data.get("hostel_id")
    room_id = data.get("room_id")

    month = data.get("month")
    year = data.get("year")

    due_date = data.get("due_date")

    monthly_rent = float(data.get("monthly_rent", 0))
    electricity_charge = float(data.get("electricity_charge", 0))
    water_charge = float(data.get("water_charge", 0))
    maintenance_charge = float(data.get("maintenance_charge", 0))
    other_charge = float(data.get("other_charge", 0))

    discount = float(data.get("discount", 0))
    fine = float(data.get("fine", 0))

    remarks = data.get("remarks")

    # --------------------------------------------------
    # Student Validation
    # --------------------------------------------------

    student = Student.query.get(student_id)

    if not student:
        raise ValueError("Student not found")

    # --------------------------------------------------
    # Hostel Validation
    # --------------------------------------------------

    hostel = Property.query.get(hostel_id)

    if not hostel:
        raise ValueError("Hostel not found")

    # --------------------------------------------------
    # Room Validation
    # --------------------------------------------------

    room = Room.query.get(room_id)

    if not room:
        raise ValueError("Room not found")

    # --------------------------------------------------
    # Duplicate Fee Validation
    # One Fee Per Student Per Month
    # --------------------------------------------------

    existing_fee = Fee.query.filter_by(
        student_id=student_id,
        month=month,
        year=year
    ).first()

    if existing_fee:
        raise ValueError(
            "Fee already generated for this month."
        )

    # --------------------------------------------------
    # Calculate Total
    # --------------------------------------------------

    total_amount = (
        monthly_rent
        + electricity_charge
        + water_charge
        + maintenance_charge
        + other_charge
        + fine
        - discount
    )

    fee = Fee(

        student_id=student_id,

        hostel_id=hostel_id,

        room_id=room_id,

        month=month,

        year=year,

        due_date=due_date,

        monthly_rent=monthly_rent,

        electricity_charge=electricity_charge,

        water_charge=water_charge,

        maintenance_charge=maintenance_charge,

        other_charge=other_charge,

        discount=discount,

        fine=fine,

        total_amount=total_amount,

        paid_amount=0,

        remaining_amount=total_amount,

        payment_status="Pending",

        remarks=remarks

    )

    db.session.add(fee)
    db.session.commit()

    return fee
# ============================================================
# Get All Fees
# ============================================================

def get_all_fees():

    fees = Fee.query.order_by(
        Fee.year.desc(),
        Fee.month.desc(),
        Fee.id.desc()
    ).all()

    return [fee.to_dict() for fee in fees]


# ============================================================
# Get Fee By ID
# ============================================================

def get_fee_by_id(fee_id):

    fee = Fee.query.get(fee_id)

    if not fee:
        raise ValueError("Fee not found.")

    return fee.to_dict()


# ============================================================
# Get Student Fee History
# ============================================================

def get_student_fee_history(student_id):

    student = Student.query.get(student_id)

    if not student:
        raise ValueError("Student not found.")

    fees = Fee.query.filter_by(
        student_id=student_id
    ).order_by(
        Fee.year.desc(),
        Fee.month.desc()
    ).all()

    return [fee.to_dict() for fee in fees]


# ============================================================
# Get Pending Fees
# ============================================================

def get_pending_fees():

    fees = Fee.query.filter(
        Fee.payment_status != "Paid"
    ).order_by(
        Fee.due_date.asc()
    ).all()

    return [fee.to_dict() for fee in fees]


# ============================================================
# Get Paid Fees
# ============================================================

def get_paid_fees():

    fees = Fee.query.filter_by(
        payment_status="Paid"
    ).order_by(
        Fee.year.desc(),
        Fee.month.desc(),
        Fee.id.desc()
    ).all()

    return [fee.to_dict() for fee in fees]


# ============================================================
# Get Monthly Fees
# ============================================================

def get_monthly_fees(month, year):

    fees = Fee.query.filter_by(
        month=month,
        year=year
    ).order_by(
        Fee.id.desc()
    ).all()

    return [fee.to_dict() for fee in fees]
# ============================================================
# Update Fee
# ============================================================

def update_fee(fee_id, data):

    fee = Fee.query.get(fee_id)

    if not fee:
        raise ValueError("Fee not found.")

    fee.monthly_rent = float(
        data.get("monthly_rent", fee.monthly_rent)
    )

    fee.electricity_charge = float(
        data.get("electricity_charge", fee.electricity_charge)
    )

    fee.water_charge = float(
        data.get("water_charge", fee.water_charge)
    )

    fee.maintenance_charge = float(
        data.get("maintenance_charge", fee.maintenance_charge)
    )

    fee.other_charge = float(
        data.get("other_charge", fee.other_charge)
    )

    fee.discount = float(
        data.get("discount", fee.discount)
    )

    fee.fine = float(
        data.get("fine", fee.fine)
    )

    fee.due_date = data.get(
        "due_date",
        fee.due_date
    )

    fee.remarks = data.get(
        "remarks",
        fee.remarks
    )

    # ------------------------------------------
    # Recalculate Total Amount
    # ------------------------------------------

    fee.total_amount = (

        fee.monthly_rent

        + fee.electricity_charge

        + fee.water_charge

        + fee.maintenance_charge

        + fee.other_charge

        + fee.fine

        - fee.discount

    )

    # ------------------------------------------
    # Remaining Amount
    # ------------------------------------------

    fee.remaining_amount = (
        fee.total_amount - fee.paid_amount
    )

    # ------------------------------------------
    # Payment Status
    # ------------------------------------------

    if fee.remaining_amount <= 0:

        fee.payment_status = "Paid"

        fee.remaining_amount = 0

    elif fee.paid_amount == 0:

        fee.payment_status = "Pending"

    else:

        fee.payment_status = "Partial"

    db.session.commit()

    return fee


# ============================================================
# Delete Fee
# ============================================================

def delete_fee(fee_id):

    fee = Fee.query.get(fee_id)

    if not fee:
        raise ValueError("Fee not found.")

    db.session.delete(fee)

    db.session.commit()

    return True
# ============================================================
# Pay Fee (Full / Partial Payment)
# ============================================================

def pay_fee(fee_id, data):

    fee = Fee.query.get(fee_id)

    if not fee:
        raise ValueError("Fee not found.")

    payment_amount = float(
        data.get("payment_amount", 0)
    )

    payment_method = data.get("payment_method")

    transaction_id = data.get("transaction_id")

    received_by = data.get("received_by")

    remarks = data.get("remarks")

    payment_date = data.get("payment_date")

    # --------------------------------------------------
    # Validation
    # --------------------------------------------------

    if payment_amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    if payment_amount > fee.remaining_amount:
        raise ValueError(
            "Payment amount cannot exceed remaining amount."
        )

    if not payment_method:
        raise ValueError(
            "Payment method is required."
        )

    # --------------------------------------------------
    # Payment Date
    # --------------------------------------------------

    if payment_date:

        payment_date = datetime.strptime(
            payment_date,
            "%Y-%m-%d"
        ).date()

    else:

        payment_date = date.today()

    # --------------------------------------------------
    # Transaction Start
    # --------------------------------------------------

    try:

        payment = FeePayment(

            fee_id=fee.id,

            payment_amount=payment_amount,

            payment_method=payment_method,

            payment_date=payment_date,

            transaction_id=transaction_id,

            received_by=received_by,

            remarks=remarks

        )

        db.session.add(payment)

        fee.paid_amount += payment_amount

        fee.remaining_amount = (
            fee.total_amount - fee.paid_amount
        )

        if fee.remaining_amount <= 0:

            fee.remaining_amount = 0

            fee.payment_status = "Paid"

        elif fee.paid_amount == 0:

            fee.payment_status = "Pending"

        else:

            fee.payment_status = "Partial"

        db.session.commit()

        return {

            "fee": fee.to_dict(),

            "payment": payment.to_dict()

        }

    except Exception as e:

        db.session.rollback()

        raise ValueError(str(e))
   # ============================================================
# Get Student Fee By Month
# ============================================================

def get_student_month_fee(student_id, month, year):

    fee = Fee.query.filter_by(
        student_id=student_id,
        month=month,
        year=year
    ).first()

    if not fee:
        raise ValueError(
            "Fee not found."
        )

    return fee.to_dict()
# ============================================================
# Get Room Fees
# ============================================================

def get_room_fees(room_id):

    room = Room.query.get(room_id)

    if not room:
        raise ValueError(
            "Room not found."
        )

    fees = Fee.query.filter_by(
        room_id=room_id
    ).order_by(
        Fee.year.desc(),
        Fee.month.desc()
    ).all()

    return [
        fee.to_dict()
        for fee in fees
    ]
    # ============================================================
# Get Hostel Fees
# ============================================================

def get_hostel_fees(hostel_id):

    hostel = Property.query.get(hostel_id)

    if not hostel:
        raise ValueError("Hostel not found.")

    fees = Fee.query.filter_by(
        hostel_id=hostel_id
    ).order_by(
        Fee.year.desc(),
        Fee.month.desc(),
        Fee.id.desc()
    ).all()

    return [
        fee.to_dict()
        for fee in fees
    ]
    # ============================================================
# Get Overdue Fees
# ============================================================

def get_overdue_fees():

    today = date.today()

    fees = Fee.query.filter(

        Fee.due_date < today,

        Fee.payment_status != "Paid"

    ).order_by(
        Fee.due_date.asc()
    ).all()

    return [
        fee.to_dict()
        for fee in fees
    ]
    # ============================================================
# Monthly Collection Report
# ============================================================

def get_monthly_collection(month, year):

    total_collection = db.session.query(

        func.coalesce(
            func.sum(
                FeePayment.payment_amount
            ),
            0
        )

    ).join(
        Fee
    ).filter(

        Fee.month == month,

        Fee.year == year

    ).scalar()

    total_fees = Fee.query.filter_by(

        month=month,

        year=year

    ).count()

    return {

        "month": month,

        "year": year,

        "total_collection": total_collection,

        "total_fees": total_fees

    }
    # ============================================================
# Fee Dashboard
# ============================================================

def get_fee_dashboard():

    dashboard = {

        "total_fees": Fee.query.count(),

        "paid_fees": Fee.query.filter_by(
            payment_status="Paid"
        ).count(),

        "pending_fees": Fee.query.filter_by(
            payment_status="Pending"
        ).count(),

        "partial_fees": Fee.query.filter_by(
            payment_status="Partial"
        ).count(),

        "total_collection":

            db.session.query(

                func.coalesce(

                    func.sum(
                        FeePayment.payment_amount
                    ),

                    0

                )

            ).scalar(),

        "total_due":

            db.session.query(

                func.coalesce(

                    func.sum(
                        Fee.remaining_amount
                    ),

                    0

                )

            ).scalar()

    }

    return dashboard
# ============================================================
# Add Payment
# ============================================================

VALID_PAYMENT_METHODS = [
    "Cash",
    "UPI",
    "Card",
    "Bank Transfer"
]


def add_payment(data):

    fee = Fee.query.get(data["fee_id"])

    if not fee:
        raise ValueError("Fee not found.")

    if fee.payment_status == "Paid":
        raise ValueError("This fee has already been paid.")

    payment_amount = float(data["payment_amount"])

    if payment_amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    if payment_amount > fee.remaining_amount:
        raise ValueError(
            "Payment amount cannot exceed remaining amount."
        )

    payment_method = data["payment_method"]

    if payment_method not in VALID_PAYMENT_METHODS:
        raise ValueError("Invalid payment method.")

    payment_date = data.get("payment_date")

    if payment_date:

        payment_date = datetime.strptime(
            payment_date,
            "%Y-%m-%d"
        ).date()

    else:

        payment_date = date.today()

    payment = FeePayment(

        fee_id=fee.id,

        payment_amount=payment_amount,

        payment_date=payment_date,

        payment_method=payment_method,

        transaction_id=data.get("transaction_id"),

        received_by=data.get("received_by"),

        remarks=data.get("remarks")

    )

    db.session.add(payment)

    fee.paid_amount += payment_amount

    fee.remaining_amount = (
        fee.total_amount - fee.paid_amount
    )

    if fee.remaining_amount <= 0:

        fee.remaining_amount = 0
        fee.payment_status = "Paid"

    elif fee.paid_amount > 0:

        fee.payment_status = "Partial"

    else:

        fee.payment_status = "Pending"

    db.session.commit()

    return payment.to_dict()


# ============================================================
# Get Single Payment
# ============================================================

def get_payment(payment_id):

    payment = FeePayment.query.get(payment_id)

    if not payment:
        raise ValueError("Payment not found.")

    fee = Fee.query.get(payment.fee_id)

    student = Student.query.get(fee.student_id)

    return {

        "payment": payment.to_dict(),

        "fee": {

            "id": fee.id,

            "student_id": fee.student_id,

            "month": fee.month,

            "year": fee.year,

            "total_amount": fee.total_amount,

            "paid_amount": fee.paid_amount,

            "remaining_amount": fee.remaining_amount,

            "payment_status": fee.payment_status

        },

        "student": {

            "id": student.id,

            "name": student.full_name

        }

    }
    # ============================================================
# Get All Payments
# ============================================================

def get_all_payments():

    payments = FeePayment.query.order_by(
        FeePayment.payment_date.desc(),
        FeePayment.id.desc()
    ).all()

    payment_list = []

    for payment in payments:

        fee = Fee.query.get(payment.fee_id)

        student = Student.query.get(fee.student_id)

        payment_list.append({

            "payment": payment.to_dict(),

            "student": {

                "id": student.id,

                "name": student.full_name

            },

            "fee": {

                "id": fee.id,

                "month": fee.month,

                "year": fee.year,

                "total_amount": fee.total_amount,

                "paid_amount": fee.paid_amount,

                "remaining_amount": fee.remaining_amount,

                "payment_status": fee.payment_status

            }

        })

    return {

        "total_payments": len(payment_list),

        "payments": payment_list

    }


# ============================================================
# Delete Payment
# ============================================================

def delete_payment(payment_id):

    payment = FeePayment.query.get(payment_id)

    if not payment:
        raise ValueError("Payment not found.")

    fee = Fee.query.get(payment.fee_id)

    if not fee:
        raise ValueError("Fee not found.")

    # -----------------------------------------
    # Delete Payment
    # -----------------------------------------

    db.session.delete(payment)
    db.session.flush()

    # -----------------------------------------
    # Recalculate Paid Amount
    # -----------------------------------------

    total_paid = db.session.query(

        func.coalesce(
            func.sum(
                FeePayment.payment_amount
            ),
            0
        )

    ).filter(

        FeePayment.fee_id == fee.id

    ).scalar()

    fee.paid_amount = float(total_paid)

    fee.remaining_amount = (
        fee.total_amount - fee.paid_amount
    )

    # -----------------------------------------
    # Update Payment Status
    # -----------------------------------------

    if fee.paid_amount <= 0:

        fee.paid_amount = 0

        fee.remaining_amount = fee.total_amount

        fee.payment_status = "Pending"

    elif fee.remaining_amount <= 0:

        fee.remaining_amount = 0

        fee.payment_status = "Paid"

    else:

        fee.payment_status = "Partial"

    db.session.commit()

    return {

        "message": "Payment deleted successfully."

    }
    # ============================================================
# Get Payment History By Fee
# ============================================================

def get_payment_history(fee_id):

    fee = Fee.query.get(fee_id)

    if not fee:
        raise ValueError("Fee not found.")

    payments = FeePayment.query.filter_by(
        fee_id=fee_id
    ).order_by(
        FeePayment.payment_date.desc(),
        FeePayment.id.desc()
    ).all()

    return {

        "fee": fee.to_dict(),

        "payments": [
            payment.to_dict()
            for payment in payments
        ],

        "total_payments": len(payments)

    }


# ============================================================
# Get Student Payment History
# ============================================================

def get_student_payment_history(student_id):

    student = Student.query.get(student_id)

    if not student:
        raise ValueError("Student not found.")

    fees = Fee.query.filter_by(
        student_id=student_id
    ).all()

    payment_history = []

    for fee in fees:

        payments = FeePayment.query.filter_by(
            fee_id=fee.id
        ).order_by(
            FeePayment.payment_date.desc(),
            FeePayment.id.desc()
        ).all()

        for payment in payments:

            payment_data = payment.to_dict()

            payment_data["month"] = fee.month
            payment_data["year"] = fee.year
            payment_data["total_amount"] = fee.total_amount
            payment_data["payment_status"] = fee.payment_status

            payment_history.append(payment_data)

    payment_history.sort(

        key=lambda x: (
            x["payment_date"],
            x["id"]
        ),

        reverse=True

    )

    return payment_history