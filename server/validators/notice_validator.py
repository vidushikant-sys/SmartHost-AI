from datetime import datetime


class NoticeValidator:

    VALID_CATEGORIES = [
        "General",
        "Fee",
        "Maintenance",
        "Event",
        "Hostel",
        "Emergency"
    ]

    VALID_PRIORITIES = [
        "Normal",
        "Important",
        "Urgent"
    ]

    VALID_STATUS = [
        "Active",
        "Expired",
        "Draft"
    ]

    # =====================================================
    # Create Notice Validation
    # =====================================================

    @staticmethod
    def validate(data):

        errors = {}

        title = str(
            data.get("title", "")
        ).strip()

        if not title:
            errors["title"] = "Title is required."

        elif len(title) < 5:
            errors["title"] = "Title must be at least 5 characters."

        elif len(title) > 200:
            errors["title"] = "Title cannot exceed 200 characters."

        description = str(
            data.get("description", "")
        ).strip()

        if not description:
            errors["description"] = "Description is required."

        elif len(description) < 10:
            errors["description"] = "Description must be at least 10 characters."

        category = str(
            data.get("category", "General")
        ).strip()

        if category not in NoticeValidator.VALID_CATEGORIES:
            errors["category"] = (
                "Category must be General, Fee, Maintenance, Event, Hostel or Emergency."
            )

        priority = str(
            data.get("priority", "Normal")
        ).strip()

        if priority not in NoticeValidator.VALID_PRIORITIES:
            errors["priority"] = (
                "Priority must be Normal, Important or Urgent."
            )

        created_by = data.get("created_by")

        if created_by in [None, ""]:
            errors["created_by"] = "Created_by is required."

        else:
            try:

                created_by = int(created_by)

                if created_by <= 0:
                    errors["created_by"] = "Created_by must be greater than zero."

            except Exception:
                errors["created_by"] = "Created_by must be an integer."

        expiry_date = data.get("expiry_date")

        if expiry_date:

            try:
                datetime.strptime(
                    expiry_date,
                    "%Y-%m-%d"
                )

            except ValueError:
                errors["expiry_date"] = (
                    "Expiry date must be in YYYY-MM-DD format."
                )

        if errors:
            return False, errors

        return True, None

    # =====================================================
    # Update Notice Validation
    # =====================================================

    @staticmethod
    def validate_update(data):

        errors = {}

        if "title" in data:

            title = str(data["title"]).strip()

            if not title:
                errors["title"] = "Title cannot be empty."

            elif len(title) < 5:
                errors["title"] = "Title must be at least 5 characters."

            elif len(title) > 200:
                errors["title"] = "Title cannot exceed 200 characters."

        if "description" in data:

            description = str(
                data["description"]
            ).strip()

            if not description:
                errors["description"] = "Description cannot be empty."

            elif len(description) < 10:
                errors["description"] = (
                    "Description must be at least 10 characters."
                )

        if "category" in data:

            if data["category"] not in NoticeValidator.VALID_CATEGORIES:

                errors["category"] = (
                    "Invalid category."
                )

        if "priority" in data:

            if data["priority"] not in NoticeValidator.VALID_PRIORITIES:

                errors["priority"] = (
                    "Invalid priority."
                )

        if "status" in data:

            if data["status"] not in NoticeValidator.VALID_STATUS:

                errors["status"] = (
                    "Invalid status."
                )

        if "expiry_date" in data and data["expiry_date"]:

            try:

                datetime.strptime(
                    data["expiry_date"],
                    "%Y-%m-%d"
                )

            except ValueError:

                errors["expiry_date"] = (
                    "Expiry date must be in YYYY-MM-DD format."
                )

        if errors:
            return False, errors

        return True, None