from config.extensions import db


class Complaint(db.Model):

    __tablename__ = "complaints"

    # -----------------------------------------
    # Primary Key
    # -----------------------------------------

    id = db.Column(
        db.Integer,
        primary_key=True
    )


    # -----------------------------------------
    # Student Relationship
    # -----------------------------------------

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )


    # -----------------------------------------
    # Complaint Information
    # -----------------------------------------

    title = db.Column(
        db.String(150),
        nullable=False
    )


    description = db.Column(
        db.Text,
        nullable=False
    )


    category = db.Column(
        db.String(50),
        nullable=False,
        default="Other"
    )

    # Examples:
    # Electricity
    # Water
    # Food
    # Cleaning
    # Maintenance
    # Security
    # Other


    # -----------------------------------------
    # Priority
    # -----------------------------------------

    priority = db.Column(
        db.String(20),
        nullable=False,
        default="Medium"
    )

    # Low
    # Medium
    # High
    # Emergency



    # -----------------------------------------
    # Complaint Status
    # -----------------------------------------

    status = db.Column(
        db.String(30),
        nullable=False,
        default="Open"
    )

    # Open
    # In Progress
    # Resolved



    # -----------------------------------------
    # Admin Response
    # -----------------------------------------

    admin_reply = db.Column(
        db.Text,
        nullable=True
    )


    # -----------------------------------------
    # Resolution Time
    # -----------------------------------------

    resolved_at = db.Column(
        db.DateTime,
        nullable=True
    )


    # -----------------------------------------
    # Timestamps
    # -----------------------------------------

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )


    # -----------------------------------------
    # Relationship
    # -----------------------------------------

    student = db.relationship(
        "Student",
        backref=db.backref(
            "complaints",
            lazy=True,
            cascade="all, delete"
        )
    )


    # -----------------------------------------
    # Convert Object To Dictionary
    # -----------------------------------------

    def to_dict(self):

        return {

            "id": self.id,

            "student_id": self.student_id,

            "student_name":
                self.student.full_name
                if self.student else None,


            "title": self.title,

            "description": self.description,

            "category": self.category,

            "priority": self.priority,

            "status": self.status,

            "admin_reply": self.admin_reply,

            "resolved_at":
                str(self.resolved_at)
                if self.resolved_at else None,


            "created_at":
                str(self.created_at),

            "updated_at":
                str(self.updated_at)

        }