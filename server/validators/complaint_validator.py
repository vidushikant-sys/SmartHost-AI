class ComplaintValidator:

    VALID_CATEGORIES = [
        "Electricity",
        "Water",
        "Food",
        "Cleaning",
        "Maintenance",
        "Security",
        "Other"
    ]

    VALID_PRIORITIES = [
        "Low",
        "Medium",
        "High",
        "Emergency"
    ]

    VALID_STATUS = [
        "Open",
        "In Progress",
        "Resolved"
    ]

    # ==========================================================
    # Create Complaint Validation
    # ==========================================================

    @staticmethod
    def validate_create(data):

        errors = {}

        if not data.get("student_id"):
            errors["student_id"] = "Student ID is required."

        if not data.get("title"):
            errors["title"] = "Title is required."

        elif len(data["title"]) > 150:
            errors["title"] = "Title cannot exceed 150 characters."

        if not data.get("description"):
            errors["description"] = "Description is required."

        category = data.get("category", "Other")

        if category not in ComplaintValidator.VALID_CATEGORIES:
            errors["category"] = (
                "Invalid complaint category."
            )

        priority = data.get("priority", "Medium")

        if priority not in ComplaintValidator.VALID_PRIORITIES:
            errors["priority"] = (
                "Invalid priority."
            )

        return (
            len(errors) == 0,
            errors
        )

    # ==========================================================
    # Update Complaint Validation
    # ==========================================================

    @staticmethod
    def validate_update(data):

        errors = {}

        if "title" in data:

            if not data["title"]:
                errors["title"] = "Title cannot be empty."

            elif len(data["title"]) > 150:
                errors["title"] = (
                    "Title cannot exceed 150 characters."
                )

        if "description" in data:

            if not data["description"]:
                errors["description"] = (
                    "Description cannot be empty."
                )

        if "category" in data:

            if data["category"] not in ComplaintValidator.VALID_CATEGORIES:

                errors["category"] = (
                    "Invalid complaint category."
                )

        if "priority" in data:

            if data["priority"] not in ComplaintValidator.VALID_PRIORITIES:

                errors["priority"] = (
                    "Invalid priority."
                )

        if "status" in data:

            if data["status"] not in ComplaintValidator.VALID_STATUS:

                errors["status"] = (
                    "Invalid complaint status."
                )

        return (
            len(errors) == 0,
            errors
        )