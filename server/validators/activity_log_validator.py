from models.admin import Admin


class ActivityLogValidator:

    @staticmethod
    def validate(data):

        errors = {}

        # ==========================================
        # Admin ID
        # ==========================================

        admin_id = data.get("admin_id")

        if admin_id in [None, ""]:

            errors["admin_id"] = "Admin ID is required."

        else:

            try:

                admin_id = int(admin_id)

                admin = Admin.query.get(admin_id)

                if not admin:

                    errors["admin_id"] = "Admin not found."

            except Exception:

                errors["admin_id"] = "Admin ID must be an integer."



        # ==========================================
        # Module
        # ==========================================

        module = str(
            data.get(
                "module",
                ""
            )
        ).strip()

        valid_modules = [

            "Authentication",

            "Hostel",

            "Room",

            "Student",

            "Allocation",

            "Fee",

            "Complaint",

            "Notice",

            "Notification",

            "Dashboard"

        ]

        if not module:

            errors["module"] = "Module is required."

        elif module not in valid_modules:

            errors["module"] = (

                f"Module must be one of: {', '.join(valid_modules)}."

            )



        # ==========================================
        # Action
        # ==========================================

        action = str(
            data.get(
                "action",
                ""
            )
        ).strip()

        valid_actions = [

            "Create",

            "Update",

            "Delete",

            "Login",

            "Logout",

            "Approve",

            "Reject"

        ]

        if not action:

            errors["action"] = "Action is required."

        elif action not in valid_actions:

            errors["action"] = (

                f"Action must be one of: {', '.join(valid_actions)}."

            )



        # ==========================================
        # Description
        # ==========================================

        description = str(
            data.get(
                "description",
                ""
            )
        ).strip()

        if not description:

            errors["description"] = "Description is required."

        elif len(description) < 5:

            errors["description"] = (

                "Description must be at least 5 characters."

            )



        # ==========================================
        # IP Address
        # ==========================================

        ip_address = str(
            data.get(
                "ip_address",
                ""
            )
        ).strip()

        if ip_address:

            if len(ip_address) > 45:

                errors["ip_address"] = (

                    "IP Address cannot exceed 45 characters."

                )



        # ==========================================
        # Return
        # ==========================================

        if errors:

            return False, errors

        return True, None