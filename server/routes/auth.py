from flask import Blueprint, request, jsonify
from config.db import db
from models.admin import Admin

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    # Check if email already exists
    existing_admin = Admin.query.filter_by(email=email).first()

    if existing_admin:
        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400

    # Create new admin
    admin = Admin(
        full_name=full_name,
        email=email,
        password=password
    )

    db.session.add(admin)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Admin Registered Successfully"
    }), 201