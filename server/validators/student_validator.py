import re
from datetime import datetime


class StudentValidator:

    @staticmethod
    def validate(data):
        errors = {}

        # ==========================
        # Full Name
        # ==========================
        full_name = str(data.get("full_name", "")).strip()

        if not full_name:
            errors["full_name"] = "Full name is required."

        elif len(full_name) < 3:
            errors["full_name"] = "Full name must be at least 3 characters."

        # ==========================
        # Email
        # ==========================
        email = str(data.get("email", "")).strip()

        email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

        if not email:
            errors["email"] = "Email is required."

        elif not re.match(email_pattern, email):
            errors["email"] = "Invalid email address."

        # ==========================
        # Phone
        # ==========================
        phone = str(data.get("phone", "")).strip()

        if not phone:
            errors["phone"] = "Phone number is required."

        elif not phone.isdigit():

            errors["phone"] = "Phone number must contain digits only."

        elif len(phone) != 10:

            errors["phone"] = "Phone number must be exactly 10 digits."

        # ==========================
        # Aadhaar
        # ==========================
        aadhaar = str(data.get("aadhaar_number", "")).strip()

        if not aadhaar:

            errors["aadhaar_number"] = "Aadhaar number is required."

        elif not aadhaar.isdigit():

            errors["aadhaar_number"] = "Aadhaar must contain digits only."

        elif len(aadhaar) != 12:

            errors["aadhaar_number"] = "Aadhaar must be exactly 12 digits."

        # ==========================
        # Guardian Name
        # ==========================
        guardian_name = str(data.get("guardian_name", "")).strip()

        if not guardian_name:

            errors["guardian_name"] = "Guardian name is required."

        # ==========================
        # Guardian Phone
        # ==========================
        guardian_phone = str(data.get("guardian_phone", "")).strip()

        if not guardian_phone:

            errors["guardian_phone"] = "Guardian phone is required."

        elif not guardian_phone.isdigit():

            errors["guardian_phone"] = "Guardian phone must contain digits only."

        elif len(guardian_phone) != 10:

            errors["guardian_phone"] = "Guardian phone must be exactly 10 digits."

        # ==========================
        # Gender
        # ==========================
        gender = str(data.get("gender", "")).strip()

        if gender not in ["Male", "Female", "Other"]:

            errors["gender"] = "Gender must be Male, Female or Other."

        # ==========================
        # Course
        # ==========================
        course = str(data.get("course", "")).strip()

        if not course:

            errors["course"] = "Course is required."

        # ==========================
        # College
        # ==========================
        college = str(data.get("college_name", "")).strip()

        if not college:

            errors["college_name"] = "College name is required."

        # ==========================
        # Semester
        # ==========================
        semester = str(data.get("semester", "")).strip()

        if not semester:

            errors["semester"] = "Semester is required."

        # ==========================
        # Address
        # ==========================
        address = str(data.get("address", "")).strip()

        if not address:

            errors["address"] = "Address is required."

        # ==========================
        # City
        # ==========================
        city = str(data.get("city", "")).strip()

        if not city:

            errors["city"] = "City is required."

        # ==========================
        # State
        # ==========================
        state = str(data.get("state", "")).strip()

        if not state:

            errors["state"] = "State is required."

        # ==========================
        # Pincode
        # ==========================
        pincode = str(data.get("pincode", "")).strip()

        if not pincode:

            errors["pincode"] = "Pincode is required."

        elif not pincode.isdigit():

            errors["pincode"] = "Pincode must contain digits only."

        elif len(pincode) != 6:

            errors["pincode"] = "Pincode must be exactly 6 digits."

        # ==========================
        # Date of Birth
        # ==========================
        date_of_birth = str(data.get("date_of_birth", "")).strip()

        if not date_of_birth:

            errors["date_of_birth"] = "Date of birth is required."

        else:
            try:
                datetime.strptime(date_of_birth, "%Y-%m-%d")
            except ValueError:
                errors["date_of_birth"] = "Date of birth must be in YYYY-MM-DD format."

        # ==========================
        # Admission Date
        # ==========================
        admission_date = str(data.get("admission_date", "")).strip()

        if not admission_date:

            errors["admission_date"] = "Admission date is required."

        else:
            try:
                datetime.strptime(admission_date, "%Y-%m-%d")
            except ValueError:
                errors["admission_date"] = "Admission date must be in YYYY-MM-DD format."

        # ==========================
        # Result
        # ==========================
        if errors:

            return False, errors

        return True, {}