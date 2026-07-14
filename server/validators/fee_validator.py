from datetime import datetime


class FeeValidator:

    # =====================================================
    # Create Fee Validation
    # =====================================================

    @staticmethod
    def validate(data):

        if data is None:
            return False, "Request body is required."

        required_fields = [
            "student_id",
            "hostel_id",
            "room_id",
            "month",
            "year",
            "due_date",
            "monthly_rent"
        ]

        for field in required_fields:

            if data.get(field) in [None, ""]:

                return False, f"{field} is required."

        # -----------------------------------------
        # Month
        # -----------------------------------------

        try:

            month = int(data["month"])

            if month < 1 or month > 12:
                return False, "Month must be between 1 and 12."

        except Exception:

            return False, "Invalid month."

        # -----------------------------------------
        # Year
        # -----------------------------------------

        try:

            year = int(data["year"])

            if year < 2000 or year > 2100:
                return False, "Invalid year."

        except Exception:

            return False, "Invalid year."

        # -----------------------------------------
        # Due Date
        # -----------------------------------------

        try:

            datetime.strptime(
                data["due_date"],
                "%Y-%m-%d"
            )

        except Exception:

            return False, "due_date must be YYYY-MM-DD."

        # -----------------------------------------
        # Amount Validation
        # -----------------------------------------

        amount_fields = [

            "monthly_rent",

            "electricity_charge",

            "water_charge",

            "maintenance_charge",

            "other_charge",

            "discount",

            "fine"

        ]

        for field in amount_fields:

            try:

                value = float(data.get(field, 0))

            except Exception:

                return False, f"Invalid {field}."

            if value < 0:

                return False, f"{field} cannot be negative."

        return True, None

    # =====================================================
    # Update Fee Validation
    # =====================================================

    @staticmethod
    def validate_update(data):

        if data is None:

            return False, "Request body is required."

        amount_fields = [

            "monthly_rent",

            "electricity_charge",

            "water_charge",

            "maintenance_charge",

            "other_charge",

            "discount",

            "fine"

        ]

        for field in amount_fields:

            if field in data:

                try:

                    value = float(data[field])

                    if value < 0:

                        return False, f"{field} cannot be negative."

                except Exception:

                    return False, f"Invalid {field}."

        if "due_date" in data:

            try:

                datetime.strptime(
                    data["due_date"],
                    "%Y-%m-%d"
                )

            except Exception:

                return False, "due_date must be YYYY-MM-DD."

        return True, None

    # =====================================================
    # Payment Validation
    # =====================================================

    @staticmethod
    def validate_payment(data):

        if data is None:

            return False, "Request body is required."

        required_fields = [

            "payment_amount",

            "payment_method"

        ]

        for field in required_fields:

            if data.get(field) in [None, ""]:

                return False, f"{field} is required."

        try:

            amount = float(data["payment_amount"])

            if amount <= 0:

                return False, "Payment amount must be greater than zero."

        except Exception:

            return False, "Invalid payment amount."

        valid_methods = [

            "Cash",

            "UPI",

            "Card",

            "Bank Transfer"

        ]

        if data["payment_method"] not in valid_methods:

            return False, "Invalid payment method."

        if data.get("payment_date"):

            try:

                datetime.strptime(
                    data["payment_date"],
                    "%Y-%m-%d"
                )

            except Exception:

                return False, "payment_date must be YYYY-MM-DD."

        return True, None