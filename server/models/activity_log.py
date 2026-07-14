from config.extensions import db


class ActivityLog(db.Model):

    __tablename__ = "activity_logs"


    # =========================================
    # Primary Key
    # =========================================

    id = db.Column(
        db.Integer,
        primary_key=True
    )


    # =========================================
    # Admin Relationship
    # =========================================

    admin_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id"),
        nullable=False
    )


    # =========================================
    # Activity Information
    # =========================================

    module = db.Column(
        db.String(50),
        nullable=False
    )

    # Examples:
    # Student
    # Room
    # Hostel
    # Fee
    # Complaint
    # Notice
    # Notification
    # Allocation
    # Dashboard


    action = db.Column(
        db.String(30),
        nullable=False
    )

    # Examples:
    # Create
    # Update
    # Delete
    # Login
    # Logout
    # Approve
    # Reject


    description = db.Column(
        db.Text,
        nullable=False
    )


    ip_address = db.Column(
        db.String(45),
        nullable=True
    )


    # =========================================
    # Timestamp
    # =========================================

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


    # =========================================
    # Relationship
    # =========================================

    admin = db.relationship(
        "Admin",
        backref=db.backref(
            "activity_logs",
            lazy=True,
            cascade="all, delete"
        )
    )


    # =========================================
    # Convert Object To Dictionary
    # =========================================

    def to_dict(self):

        return {

            "id": self.id,

            "admin_id": self.admin_id,

            "admin_email": (
                self.admin.email
                if self.admin
                else None
            ),

            "module": self.module,

            "action": self.action,

            "description": self.description,

            "ip_address": self.ip_address,

            "created_at": (
                str(self.created_at)
                if self.created_at
                else None
            )

        }