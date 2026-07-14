from models.student import Student


class NotificationValidator:

    VALID_TYPES = [
        "Fee",
        "Complaint",
        "Notice",
        "Allocation",
        "General"
    ]

    @staticmethod
    def validate(data):

        errors = {}

        # ==========================================
        # Student
        # ==========================================

        student_id = data.get("student_id")

        if student_id is None:

            errors["student_id"] = "Student ID is required."

        else:

            student = Student.query.get(student_id)

            if not student:

                errors["student_id"] = "Student not found."

        # ==========================================
        # Title
        # ==========================================

        title = str(
            data.get("title", "")
        ).strip()

        if not title:

            errors["title"] = "Title is required."

        elif len(title) < 3:

            errors["title"] = (
                "Title must be at least 3 characters."
            )

        elif len(title) > 150:

            errors["title"] = (
                "Title cannot exceed 150 characters."
            )

        # ==========================================
        # Message
        # ==========================================

        message = str(
            data.get("message", "")
        ).strip()

        if not message:

            errors["message"] = "Message is required."

        elif len(message) < 5:

            errors["message"] = (
                "Message must be at least 5 characters."
            )

        # ==========================================
        # Type
        # ==========================================

        notification_type = str(
            data.get("type", "General")
        ).strip()

        if notification_type not in NotificationValidator.VALID_TYPES:

            errors["type"] = (
                "Invalid notification type."
            )

        # ==========================================
        # Return
        # ==========================================

        if errors:

            return False, errors

        return True, None