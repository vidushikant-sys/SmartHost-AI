import re


class RoomValidator:

    @staticmethod
    def validate(data):

        errors = {}

        # ==========================================
        # Hostel ID
        # ==========================================
        hostel_id = data.get("hostel_id")

        if hostel_id in [None, ""]:
            errors["hostel_id"] = "Hostel ID is required."

        else:
            try:
                hostel_id = int(hostel_id)

                if hostel_id <= 0:
                    errors["hostel_id"] = "Hostel ID must be greater than 0."

            except Exception:
                errors["hostel_id"] = "Hostel ID must be an integer."

        # ==========================================
        # Room Number
        # ==========================================
        room_number = str(data.get("room_number", "")).strip()

        if not room_number:
            errors["room_number"] = "Room number is required."

        elif len(room_number) > 50:
            errors["room_number"] = "Room number is too long."

        # ==========================================
        # Floor
        # ==========================================
        floor = data.get("floor")

        if floor in [None, ""]:
            errors["floor"] = "Floor is required."

        else:
            try:
                floor = int(floor)

                if floor < 0:
                    errors["floor"] = "Floor cannot be negative."

            except Exception:
                errors["floor"] = "Floor must be an integer."

        # ==========================================
        # Room Type
        # ==========================================
        room_type = str(data.get("room_type", "")).strip()

        valid_room_types = [
            "Standard",
            "Deluxe",
            "Premium",
            "AC",
            "Non AC"
        ]

        if not room_type:
            errors["room_type"] = "Room type is required."

        elif room_type not in valid_room_types:
            errors["room_type"] = (
                "Room type must be Standard, Deluxe, Premium, AC or Non AC."
            )

        # ==========================================
        # Sharing Type
        # ==========================================
        sharing_type = str(data.get("sharing_type", "")).strip()

        valid_sharing = [
            "Single",
            "Double",
            "Triple",
            "Four Sharing"
        ]

        if not sharing_type:
            errors["sharing_type"] = "Sharing type is required."

        elif sharing_type not in valid_sharing:
            errors["sharing_type"] = (
                "Sharing type must be Single, Double, Triple or Four Sharing."
            )

        # ==========================================
        # Total Beds
        # ==========================================
        total_beds = data.get("total_beds")

        if total_beds in [None, ""]:
            errors["total_beds"] = "Total beds is required."

        else:
            try:
                total_beds = int(total_beds)

                if total_beds <= 0:
                    errors["total_beds"] = "Total beds must be greater than 0."

            except Exception:
                errors["total_beds"] = "Total beds must be an integer."

        # ==========================================
        # Available Beds
        # ==========================================
        available_beds = data.get("available_beds")

        if available_beds in [None, ""]:
            errors["available_beds"] = "Available beds is required."

        else:
            try:
                available_beds = int(available_beds)

                if available_beds < 0:
                    errors["available_beds"] = "Available beds cannot be negative."

            except Exception:
                errors["available_beds"] = "Available beds must be an integer."

        # ==========================================
        # Monthly Fee
        # ==========================================
        monthly_fee = data.get("monthly_fee")

        if monthly_fee in [None, ""]:
            errors["monthly_fee"] = "Monthly fee is required."

        else:
            try:
                monthly_fee = float(monthly_fee)

                if monthly_fee <= 0:
                    errors["monthly_fee"] = "Monthly fee must be greater than 0."

            except Exception:
                errors["monthly_fee"] = "Monthly fee must be numeric."

        # ==========================================
        # Status
        # ==========================================
        status = str(data.get("status", "")).strip()

        valid_status = [
            "Available",
            "Occupied",
            "Maintenance"
        ]

        if not status:
            errors["status"] = "Status is required."

        elif status not in valid_status:
            errors["status"] = (
                "Status must be Available, Occupied or Maintenance."
            )

        # ==========================================
        # Description
        # ==========================================
        description = str(data.get("description", "")).strip()

        if description and len(description) > 1000:
            errors["description"] = "Description is too long."

        # ==========================================
        # Facilities
        # ==========================================
        facilities = data.get("facilities", [])

        if facilities and not isinstance(facilities, list):
            errors["facilities"] = "Facilities must be a list."

        # ==========================================
        # Available Beds Validation
        # ==========================================
        if (
            "total_beds" not in errors and
            "available_beds" not in errors
        ):
            if available_beds > total_beds:
                errors["available_beds"] = (
                    "Available beds cannot exceed total beds."
                )

        # ==========================================
        # Return
        # ==========================================
        if errors:
            return False, errors

        return True, None