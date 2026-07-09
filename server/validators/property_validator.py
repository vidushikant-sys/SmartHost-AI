import re


class PropertyValidator:

    @staticmethod
    def validate(data):

        errors = {}

        # ==========================================
        # Title
        # ==========================================
        title = str(data.get("title", "")).strip()

        if not title:
            errors["title"] = "Hostel title is required."

        elif len(title) < 3:
            errors["title"] = "Hostel title must be at least 3 characters."

        # ==========================================
        # Description
        # ==========================================
        description = str(data.get("description", "")).strip()

        if not description:
            errors["description"] = "Description is required."

        elif len(description) < 10:
            errors["description"] = "Description must be at least 10 characters."

        # ==========================================
        # Hostel Type
        # ==========================================
        hostel_type = str(data.get("hostel_type", "")).strip()

        valid_types = [
            "Boys Hostel",
            "Girls Hostel",
            "PG",
            "Apartment"
        ]

        if not hostel_type:
            errors["hostel_type"] = "Hostel type is required."

        elif hostel_type not in valid_types:
            errors["hostel_type"] = (
                "Hostel type must be Boys Hostel, Girls Hostel, PG or Apartment."
            )

        # ==========================================
        # Address
        # ==========================================
        address = str(data.get("address", "")).strip()

        if not address:
            errors["address"] = "Address is required."

        # ==========================================
        # City
        # ==========================================
        city = str(data.get("city", "")).strip()

        if not city:
            errors["city"] = "City is required."

        # ==========================================
        # State
        # ==========================================
        state = str(data.get("state", "")).strip()

        if not state:
            errors["state"] = "State is required."

        # ==========================================
        # Country
        # ==========================================
        country = str(data.get("country", "")).strip()

        if not country:
            errors["country"] = "Country is required."

        # ==========================================
        # Pincode
        # ==========================================
        pincode = str(data.get("pincode", "")).strip()

        if not pincode:
            errors["pincode"] = "Pincode is required."

        elif not re.fullmatch(r"\d{6}", pincode):
            errors["pincode"] = "Pincode must be exactly 6 digits."

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
        # Total Capacity
        # ==========================================
        total_capacity = data.get("total_capacity")

        if total_capacity in [None, ""]:
            errors["total_capacity"] = "Total capacity is required."

        else:
            try:
                total_capacity = int(total_capacity)

                if total_capacity <= 0:
                    errors["total_capacity"] = "Total capacity must be greater than 0."

            except Exception:
                errors["total_capacity"] = "Total capacity must be an integer."

        # ==========================================
        # Bedrooms
        # ==========================================
        bedrooms = data.get("bedrooms", 0)

        try:
            bedrooms = int(bedrooms)

            if bedrooms < 0:
                errors["bedrooms"] = "Bedrooms cannot be negative."

        except Exception:
            errors["bedrooms"] = "Bedrooms must be an integer."

        # ==========================================
        # Bathrooms
        # ==========================================
        bathrooms = data.get("bathrooms", 0)

        try:
            bathrooms = int(bathrooms)

            if bathrooms < 0:
                errors["bathrooms"] = "Bathrooms cannot be negative."

        except Exception:
            errors["bathrooms"] = "Bathrooms must be an integer."

        # ==========================================
        # Amenities
        # ==========================================
        amenities = data.get("amenities", [])

        if amenities and not isinstance(amenities, list):
            errors["amenities"] = "Amenities must be a list."

        # ==========================================
        # Return
        # ==========================================
        if errors:
            return False, errors

        return True, None