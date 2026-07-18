from config.extensions import db


class Notice(db.Model):

    __tablename__ = "notices"


    # =========================================
    # Primary Key
    # =========================================

    id = db.Column(
        db.Integer,
        primary_key=True
    )


    # =========================================
    # Notice Information
    # =========================================

    title = db.Column(
        db.String(200),
        nullable=False
    )


    description = db.Column(
        db.Text,
        nullable=False
    )


    category = db.Column(
        db.String(50),
        nullable=False,
        default="General"
    )

    # General
    # Fee
    # Maintenance
    # Event
    # Hostel
    # Emergency



    priority = db.Column(
        db.String(20),
        nullable=False,
        default="Normal"
    )

    # Normal
    # Important
    # Urgent



    # =========================================
    # Status
    # =========================================

    status = db.Column(
        db.String(20),
        nullable=False,
        default="Active"
    )

    # Active
    # Expired
    # Draft



    # =========================================
    # Admin Information
    # =========================================

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("admins.id"),
        nullable=False
    )


    # =========================================
    # Hostel Scope
    # =========================================
    # NULL = global notice, visible under every hostel.
    # Set = notice only applies to that specific hostel.

    hostel_id = db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=True
    )



    # =========================================
    # Expiry
    # =========================================

    expiry_date = db.Column(
        db.Date,
        nullable=True
    )



    # =========================================
    # Timestamps
    # =========================================

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )



    # =========================================
    # Relationship
    # =========================================

    admin = db.relationship(
        "Admin",
        backref=db.backref(
            "notices",
            lazy=True,
            cascade="all, delete"
        )
    )

    hostel = db.relationship(
        "Property",
        backref=db.backref(
            "notices",
            lazy=True
        )
    )



    # =========================================
    # Convert To Dictionary
    # =========================================

    def to_dict(self):

        return {

            "id": self.id,

            "title": self.title,

            "description": self.description,

            "category": self.category,

            "priority": self.priority,

            "status": self.status,

            "created_by": self.created_by,

            "admin_name": (
    self.admin.email
    if self.admin
    else None
),

            "hostel_id": self.hostel_id,

            "hostel_name": (
                self.hostel.title
                if self.hostel
                else None
            ),

            "expiry_date": (
                str(self.expiry_date)
                if self.expiry_date
                else None
            ),

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