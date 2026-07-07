from config.extensions import db


class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.Integer, primary_key=True)

    # Foreign Key -> Hostel(Property)
    hostel_id = db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=False
    )

    room_number = db.Column(
        db.String(20),
        nullable=False
    )

    floor = db.Column(
        db.Integer,
        nullable=False
    )

    room_type = db.Column(
        db.String(50),
        nullable=False
    )
    # Example:
    # Standard
    # Deluxe
    # Premium
    # AC
    # Non-AC

    sharing_type = db.Column(
        db.String(30),
        nullable=False
    )
    # Example:
    # Single
    # Double
    # Triple
    # Four Sharing

    monthly_fee = db.Column(
        db.Float,
        nullable=False
    )

    total_beds = db.Column(
        db.Integer,
        nullable=False
    )

    available_beds = db.Column(
        db.Integer,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="Available"
    )
    # Available
    # Full
    # Maintenance

    description = db.Column(
        db.Text
    )

    facilities = db.Column(
        db.JSON
    )
    # Example:
    # ["WiFi","Fan","AC","Study Table"]

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    # Relationship with Hostel(Property)
    hostel = db.relationship(
        "Property",
        backref=db.backref(
            "rooms",
            lazy=True,
            cascade="all, delete"
        )
    )