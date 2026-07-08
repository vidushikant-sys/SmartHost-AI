from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from services.upload_service import (
    upload_student_image,
    upload_hostel_image,
    upload_room_image
)

from utils.response import (
    success_response,
    error_response
)


upload_bp = Blueprint(
    "upload",
    __name__
)



# =====================================
# Upload Student Image
# =====================================

@upload_bp.route(
    "/student",
    methods=["POST"]
)
@jwt_required()
def upload_student():

    try:

        file = request.files.get(
            "file"
        )


        if not file:

            return error_response(
                "No file provided",
                400
            )


        image_path = upload_student_image(
            file
        )


        return success_response(
            "Student image uploaded successfully",
            {
                "image_url": image_path
            }
        )


    except ValueError as e:

        return error_response(
            str(e),
            400
        )


    except Exception as e:

        print(
            "STUDENT UPLOAD ERROR:",
            e
        )

        return error_response(
            "Internal server error",
            500
        )



# =====================================
# Upload Hostel Image
# =====================================

@upload_bp.route(
    "/hostel",
    methods=["POST"]
)
@jwt_required()
def upload_hostel():

    try:

        file = request.files.get(
            "file"
        )


        if not file:

            return error_response(
                "No file provided",
                400
            )


        image_path = upload_hostel_image(
            file
        )


        return success_response(
            "Hostel image uploaded successfully",
            {
                "image_url": image_path
            }
        )


    except ValueError as e:

        return error_response(
            str(e),
            400
        )


    except Exception as e:

        print(
            "HOSTEL UPLOAD ERROR:",
            e
        )

        return error_response(
            "Internal server error",
            500
        )



# =====================================
# Upload Room Image
# =====================================

@upload_bp.route(
    "/room",
    methods=["POST"]
)
@jwt_required()
def upload_room():

    try:

        file = request.files.get(
            "file"
        )


        if not file:

            return error_response(
                "No file provided",
                400
            )


        image_path = upload_room_image(
            file
        )


        return success_response(
            "Room image uploaded successfully",
            {
                "image_url": image_path
            }
        )


    except ValueError as e:

        return error_response(
            str(e),
            400
        )


    except Exception as e:

        print(
            "ROOM UPLOAD ERROR:",
            e
        )

        return error_response(
            "Internal server error",
            500
        )