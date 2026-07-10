from datetime import datetime


class AllocationValidator:

    @staticmethod
    def validate_allocate(data):

        errors = {}

        # ==========================================
        # Student ID
        # ==========================================
        student_id = data.get("student_id")

        if student_id is None:
            errors["student_id"] = "Student ID is required."

        elif not isinstance(student_id, int):
            errors["student_id"] = "Student ID must be an integer."

        elif student_id <= 0:
            errors["student_id"] = "Student ID must be greater than 0."

        # ==========================================
        # Room ID
        # ==========================================
        room_id = data.get("room_id")

        if room_id is None:
            errors["room_id"] = "Room ID is required."

        elif not isinstance(room_id, int):
            errors["room_id"] = "Room ID must be an integer."

        elif room_id <= 0:
            errors["room_id"] = "Room ID must be greater than 0."

        # ==========================================
        # Allocation Date
        # ==========================================
        allocated_date = data.get("allocated_date")

        if not allocated_date:
            errors["allocated_date"] = "Allocated date is required."

        else:
            try:
                datetime.strptime(
                    allocated_date,
                    "%Y-%m-%d"
                )

            except ValueError:
                errors["allocated_date"] = (
                    "Allocated date must be YYYY-MM-DD."
                )

        # ==========================================
        # Remarks
        # ==========================================
        remarks = data.get("remarks")

        if remarks:

            if not isinstance(remarks, str):
                errors["remarks"] = "Remarks must be a string."

            elif len(remarks.strip()) > 300:
                errors["remarks"] = (
                    "Remarks cannot exceed 300 characters."
                )

        # ==========================================
        # Return
        # ==========================================
        if errors:
            return False, errors

        return True, None

    # =====================================================
    # Transfer Validation
    # =====================================================

    @staticmethod
    def validate_transfer(data):

        errors = {}

        room_id = data.get("room_id")

        if room_id is None:
            errors["room_id"] = "Room ID is required."

        elif not isinstance(room_id, int):
            errors["room_id"] = "Room ID must be an integer."

        elif room_id <= 0:
            errors["room_id"] = "Room ID must be greater than 0."

        allocated_date = data.get("allocated_date")

        if not allocated_date:
            errors["allocated_date"] = "Transfer date is required."

        else:

            try:
                datetime.strptime(
                    allocated_date,
                    "%Y-%m-%d"
                )

            except ValueError:
                errors["allocated_date"] = (
                    "Transfer date must be YYYY-MM-DD."
                )

        remarks = data.get("remarks")

        if remarks:

            if not isinstance(remarks, str):
                errors["remarks"] = "Remarks must be a string."

            elif len(remarks.strip()) > 300:
                errors["remarks"] = (
                    "Remarks cannot exceed 300 characters."
                )

        if errors:
            return False, errors

        return True, None

    # =====================================================
    # Vacate Validation
    # =====================================================

    @staticmethod
    def validate_vacate(data):

        errors = {}

        vacated_date = data.get("vacated_date")

        if not vacated_date:
            errors["vacated_date"] = "Vacated date is required."

        else:

            try:
                datetime.strptime(
                    vacated_date,
                    "%Y-%m-%d"
                )

            except ValueError:
                errors["vacated_date"] = (
                    "Vacated date must be YYYY-MM-DD."
                )

        remarks = data.get("remarks")

        if remarks:

            if not isinstance(remarks, str):
                errors["remarks"] = "Remarks must be a string."

            elif len(remarks.strip()) > 300:
                errors["remarks"] = (
                    "Remarks cannot exceed 300 characters."
                )

        if errors:
            return False, errors

        return True, None