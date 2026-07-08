from config.extensions import db


class Fee(db.Model):
    __tablename__ = "fees"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # -----------------------------------------
    # Relationships
    # -----------------------------------------

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )

    hostel_id = db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=False
    )

    room_id = db.Column(
        db.Integer,
        db.ForeignKey("rooms.id"),
        nullable=False
    )
        # -----------------------------------------
    # Billing Information
    # -----------------------------------------

    month = db.Column(
        db.Integer,
        nullable=False
    )
    # Example:
    # 1 = January
    # 2 = February
    # ...
    # 12 = December

    year = db.Column(
        db.Integer,
        nullable=False
    )

    due_date = db.Column(
        db.Date,
        nullable=False
    )

    # -----------------------------------------
    # Charges
    # -----------------------------------------

    monthly_rent = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    electricity_charge = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    water_charge = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    maintenance_charge = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    other_charge = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    # -----------------------------------------
    # Discount & Fine
    # -----------------------------------------

    discount = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    fine = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    # -----------------------------------------
    # Amount Summary
    # -----------------------------------------

    total_amount = db.Column(
        db.Float,
        nullable=False
    )

    paid_amount = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    remaining_amount = db.Column(
        db.Float,
        nullable=False
    )
        # -----------------------------------------
    # Payment Details
    # -----------------------------------------

    payment_status = db.Column(
        db.String(20),
        nullable=False,
        default="Pending"
    )
    # Pending
    # Partial
    # Paid

    remarks = db.Column(
        db.Text
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
    # Relationships
    # -----------------------------------------

    student = db.relationship(
        "Student",
        backref=db.backref(
            "fees",
            lazy=True,
            cascade="all, delete"
        )
    )

    hostel = db.relationship(
        "Property",
        backref=db.backref(
            "fees",
            lazy=True,
            cascade="all, delete"
        )
    )

    room = db.relationship(
        "Room",
        backref=db.backref(
            "fees",
            lazy=True,
            cascade="all, delete"
        )
    )

    payments = db.relationship(
        "FeePayment",
        backref="fee",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # -----------------------------------------
    # Convert Object to Dictionary
    # -----------------------------------------

    def to_dict(self):

        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": self.student.full_name if self.student else None,

            "hostel_id": self.hostel_id,
            "hostel_name": self.hostel.title if self.hostel else None,
            "room_id": self.room_id,
            "room_number": self.room.room_number if self.room else None,

            "month": self.month,
            "year": self.year,
            "due_date": str(self.due_date),

            "monthly_rent": self.monthly_rent,
            "electricity_charge": self.electricity_charge,
            "water_charge": self.water_charge,
            "maintenance_charge": self.maintenance_charge,
            "other_charge": self.other_charge,

            "discount": self.discount,
            "fine": self.fine,

            "total_amount": self.total_amount,
            "paid_amount": self.paid_amount,
            "remaining_amount": self.remaining_amount,

            "payment_status": self.payment_status,

            "remarks": self.remarks,

            "created_at": str(self.created_at),
            "updated_at": str(self.updated_at)
        }