import os
import uuid
from werkzeug.utils import secure_filename


# =====================================
# Upload Configuration
# =====================================

BASE_UPLOAD_FOLDER = os.path.join(
    os.getcwd(),
    "uploads"
)


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp"
}


# =====================================
# Check Extension
# =====================================

def allowed_file(filename):

    if "." not in filename:
        return False

    extension = filename.rsplit(
        ".",
        1
    )[1].lower()

    return extension in ALLOWED_EXTENSIONS



# =====================================
# Create Upload Folder
# =====================================

def create_folder(folder):

    if not os.path.exists(folder):

        os.makedirs(
            folder
        )



# =====================================
# Save File Function
# =====================================

def save_file(
    file,
    category
):

    try:

        if file is None:

            return None


        filename = secure_filename(
            file.filename
        )


        if not allowed_file(filename):

            raise ValueError(
                "File type not allowed"
            )


        # Create category folder

        upload_path = os.path.join(
            BASE_UPLOAD_FOLDER,
            category
        )


        create_folder(
            upload_path
        )


        # Unique filename

        extension = filename.rsplit(
            ".",
            1
        )[1]


        new_filename = (
            str(uuid.uuid4())
            +
            "."
            +
            extension
        )


        file_path = os.path.join(
            upload_path,
            new_filename
        )


        # Save file

        file.save(
            file_path
        )


        # Return database path

        return (
            "/uploads/"
            +
            category
            +
            "/"
            +
            new_filename
        )


    except Exception:

        raise



# =====================================
# Student Image Upload
# =====================================

def upload_student_image(file):

    return save_file(
        file,
        "students"
    )



# =====================================
# Hostel Image Upload
# =====================================

def upload_hostel_image(file):

    return save_file(
        file,
        "hostels"
    )



# =====================================
# Room Image Upload
# =====================================

def upload_room_image(file):

    return save_file(
        file,
        "rooms"
    )