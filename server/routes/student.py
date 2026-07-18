from flask import Blueprint, request

from services.student_service import (
    create_student,
    get_all_students,
    get_student_by_id,
    update_student,
    delete_student
)

from utils.response import success_response, error_response


student_bp = Blueprint(
    "student",
    __name__
)


# ==================================================
# Add Student
# ==================================================
@student_bp.route("/add", methods=["POST"])
def add_student():

    data = request.get_json()

    student, error = create_student(data)

    if error:

        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        return error_response(
            error,
            400
        )

    return success_response(
        "Student Added Successfully",
        {
            "student_id": student.id
        },
        201
    )


# ==================================================
# Get All Students
# ==================================================
@student_bp.route("/all", methods=["GET"])
def all_students():

    hostel_id = request.args.get("hostel_id", type=int)

    students = get_all_students(hostel_id)

    return success_response(
        "Students fetched successfully",
        students
    )

# ==================================================
# Get Student By ID
# ==================================================
@student_bp.route("/<int:student_id>", methods=["GET"])
def student_details(student_id):

    student = get_student_by_id(student_id)

    if student is None:
        return error_response(
            "Student not found",
            404
        )

    return success_response(
        "Student fetched successfully",
        student
    )


# ==================================================
# Update Student
# ==================================================
@student_bp.route("/update/<int:student_id>", methods=["PUT"])
def edit_student(student_id):

    data = request.get_json()

    student, error = update_student(student_id, data)

    if error:

        if isinstance(error, dict):
            return error_response(
                "Validation failed",
                400,
                error
            )

        if error == "Student not found":
            return error_response(
                error,
                404
            )

        return error_response(
            error,
            400
        )

    return success_response(
        "Student Updated Successfully",
        {
            "student": student.id
        }
    )


# ==================================================
# Delete Student
# ==================================================
@student_bp.route("/delete/<int:student_id>", methods=["DELETE"])
def remove_student(student_id):

    deleted = delete_student(student_id)

    if not deleted:
        return error_response(
            "Student not found",
            404
        )

    return success_response(
        "Student Deleted Successfully"
    )