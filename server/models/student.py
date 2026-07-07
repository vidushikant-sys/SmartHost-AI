from config.extensions import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==========================
    # Personal Details
    # ==========================
    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    phone = db.Column(
        db.String(15),
        unique=True,
        nullable=False
    )

    gender = db.Column(
        db.String(20),
        nullable=False
    )

    date_of_birth = db.Column(
        db.Date,
        nullable=False
    )

    aadhaar_number = db.Column(
        db.String(20),
        unique=True,
        nullable=True
    )

    # ==========================
    # Education Details
    # ==========================
    college_name = db.Column(
        db.String(200),
        nullable=False
    )

    course = db.Column(
        db.String(100),
        nullable=False
    )

    semester = db.Column(
        db.String(30),
        nullable=False
    )

    # ==========================
    # Guardian Details
    # ==========================
    guardian_name = db.Column(
        db.String(150),
        nullable=False
    )

    guardian_phone = db.Column(
        db.String(15),
        nullable=False
    )

    emergency_contact = db.Column(
        db.String(15),
        nullable=True
    )

    # ==========================
    # Address Details
    # ==========================
    address = db.Column(
        db.Text,
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

    pincode = db.Column(
        db.String(20),
        nullable=False
    )

    # ==========================
    # Documents
    # ==========================
    profile_photo = db.Column(
        db.String(255),
        nullable=True
    )

    id_proof = db.Column(
        db.String(255),
        nullable=True
    )

    # ==========================
    # Hostel Details
    # ==========================
    admission_date = db.Column(
        db.Date,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="Active"
    )
    # Active / Inactive / Left

    # ==========================
    # Timestamp
    # ==========================
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )