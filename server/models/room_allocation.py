from config.extensions import db


class RoomAllocation(db.Model):
    __tablename__ = "room_allocations"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # =====================================
    # Relationships
    # =====================================

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )

    # =====================================
    # Allocation Details
    # =====================================

    allocated_date = db.Column(
        db.Date,
        nullable=False
    )

    vacated_date = db.Column(
        db.Date,
        nullable=True
    )

    allocation_status = db.Column(
        db.String(30),
        nullable=False,
        default="Allocated"
    )
    # Allocated
    # Vacated
    # Transferred

    remarks = db.Column(
        db.Text,
        nullable=True
    )

    # =====================================
    # Timestamp
    # =====================================

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    # =====================================
    # Relationships
    # =====================================

    student = db.relationship(
        "Student",
        backref=db.backref(
            "allocations",
            lazy=True
        )
    )

    room = db.relationship(
        "Room",
        backref=db.backref(
            "allocations",
            lazy=True
        )
    )
    