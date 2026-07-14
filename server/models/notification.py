from config.extensions import db


class Notification(db.Model):

    __tablename__ = "notifications"

    # ==========================================
    # Primary Key
    # ==========================================

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==========================================
    # Student
    # ==========================================

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )

    # ==========================================
    # Notification
    # ==========================================

    title = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    # ==========================================
    # Notification Type
    # ==========================================

    type = db.Column(
        db.String(30),
        nullable=False,
        default="General"
    )

    # Fee
    # Complaint
    # Notice
    # Allocation
    # General

    # ==========================================
    # Read Status
    # ==========================================

    is_read = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    # ==========================================
    # Timestamp
    # ==========================================

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    # ==========================================
    # Relationship
    # ==========================================

    student = db.relationship(
        "Student",
        backref=db.backref(
            "notifications",
            lazy=True,
            cascade="all, delete"
        )
    )

    # ==========================================
    # Convert To Dictionary
    # ==========================================

    def to_dict(self):

        return {

            "id": self.id,

            "student_id": self.student_id,

            "student_name": (
                self.student.full_name
                if self.student
                else None
            ),

            "title": self.title,

            "message": self.message,

            "type": self.type,

            "is_read": self.is_read,

            "created_at": (
                str(self.created_at)
                if self.created_at
                else None
            ),

            "updated_at": (
                str(self.updated_at)
                if self.updated_at
                else None
            )

        }