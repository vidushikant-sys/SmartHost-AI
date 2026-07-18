from config.extensions import db


class Room(db.Model):

    __tablename__ = "rooms"


    # =====================================
    # Basic Information
    # =====================================

    id = db.Column(
        db.Integer,
        primary_key=True
    )


    hostel_id = db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=False
    )


    room_number = db.Column(
        db.String(50),
        nullable=False
    )


    floor = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )


    room_type = db.Column(
        db.String(100),
        nullable=False
    )


    sharing_type = db.Column(
        db.String(50),
        nullable=False
    )


    # =====================================
    # Room Capacity
    # =====================================

    total_beds = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )


    available_beds = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )


    # =====================================
    # Pricing
    # =====================================

    monthly_fee = db.Column(
        db.Float,
        nullable=False,
        default=0
    )


    # =====================================
    # Status
    # =====================================

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Available"
    )


    # =====================================
    # Extra Details
    # =====================================

    description = db.Column(
        db.Text
    )


    facilities = db.Column(
        db.JSON
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
    # Relationship
    # =====================================

    hostel = db.relationship(
        "Property",
        backref=db.backref(
            "rooms",
            lazy=True
        )
    )


    # =====================================
    # Convert Object To Dictionary
    # =====================================

    def to_dict(self):

        return {

            "id": self.id,

            "hostel_id": self.hostel_id,

            "hostel_name": self.hostel.title if self.hostel else None,

            "room_number": self.room_number,

            "floor": self.floor,

            "room_type": self.room_type,

            "sharing_type": self.sharing_type,

            "monthly_fee": self.monthly_fee,

            "total_beds": self.total_beds,

            "available_beds": self.available_beds,

            "occupied_beds": self.total_beds - self.available_beds,

            "status": self.status,

            "description": self.description,

            "facilities": self.facilities,

            "created_at": str(self.created_at),

            "updated_at": str(self.updated_at)

        }