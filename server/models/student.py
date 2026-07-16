from config.extensions import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    def to_dict(self):

        return {
            "id": self.id,

            "full_name": self.full_name,

            "email": self.email,

            "phone": self.phone,

            "gender": self.gender,

            "date_of_birth": str(self.date_of_birth)
            if self.date_of_birth else None,

            "aadhaar_number": self.aadhaar_number,

            "guardian_name": self.guardian_name,

            "guardian_phone": self.guardian_phone,

            "emergency_contact": self.emergency_contact,

            "profile_photo": self.profile_photo,

            "id_proof": self.id_proof,

            "address": self.address,

            "city": self.city,

            "state": self.state,

            "pincode": self.pincode,

            "college_name": self.college_name,

            "course": self.course,

            "semester": self.semester,

            "admission_date": str(self.admission_date)
            if self.admission_date else None,

            "status": self.status,

            "created_at": str(self.created_at),

            "updated_at": str(self.updated_at)
        }
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