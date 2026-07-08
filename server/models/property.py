from config.extensions import db


class Property(db.Model):

    __tablename__ = "properties"


    # -----------------------------------------
    # Primary Key
    # -----------------------------------------

    id = db.Column(
        db.Integer,
        primary_key=True
    )


    # -----------------------------------------
    # Owner Reference
    # -----------------------------------------

    owner_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id"),
        nullable=False
    )


    # -----------------------------------------
    # Hostel Information
    # -----------------------------------------

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


    # -----------------------------------------
    # Location
    # -----------------------------------------

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


    # -----------------------------------------
    # Hostel Details
    # -----------------------------------------

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


    # -----------------------------------------
    # Timestamp
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
    # Convert Object To Dictionary
    # -----------------------------------------

    def to_dict(self):

        return {

            "id": self.id,

            "owner_id": self.owner_id,

            "title": self.title,

            "description": self.description,

            "hostel_type": self.hostel_type,

            "address": self.address,

            "city": self.city,

            "state": self.state,

            "country": self.country,

            "pincode": self.pincode,

            "monthly_fee": self.monthly_fee,

            "total_capacity": self.total_capacity,

            "bedrooms": self.bedrooms,

            "bathrooms": self.bathrooms,

            "amenities": self.amenities,

            "created_at": str(self.created_at),

            "updated_at": str(self.updated_at)

        }