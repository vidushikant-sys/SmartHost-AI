from config.extensions import db


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)

    owner_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id"),
        nullable=False
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    hostel_type = db.Column(
        db.String(50),
        nullable=False
    )

    address = db.Column(
        db.String(255),
        nullable=False
    )

    city = db.Column(
        db.String(100),
        nullable=False
    )

    state = db.Column(
        db.String(100),
        nullable=False
    )

    country = db.Column(
        db.String(100),
        nullable=False
    )

    pincode = db.Column(
        db.String(20),
        nullable=False
    )

    monthly_fee = db.Column(
        db.Float,
        nullable=False
    )

    total_capacity = db.Column(
        db.Integer,
        nullable=False
    )

    bedrooms = db.Column(
        db.Integer,
        default=0
    )

    bathrooms = db.Column(
        db.Integer,
        default=0
    )

    amenities = db.Column(
        db.JSON
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )