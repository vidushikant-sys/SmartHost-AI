from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from config.extensions import db, bcrypt
from models.admin import Admin

auth = Blueprint("auth", __name__)


# ==========================
# Register API
# ==========================
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

    # Hash Password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create New Admin
    admin = Admin(
        full_name=full_name,
        email=email,
        password=hashed_password
    )

    db.session.add(admin)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Admin Registered Successfully"
    }), 201


# ==========================
# Login API
# ==========================
@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Check Email
    admin = Admin.query.filter_by(email=email).first()

    if not admin:
        return jsonify({
            "success": False,
            "message": "Invalid Email or Password"
        }), 401

    # Check Password
    if not bcrypt.check_password_hash(admin.password, password):
        return jsonify({
            "success": False,
            "message": "Invalid Email or Password"
        }), 401

    # Generate JWT Token
    access_token = create_access_token(identity=str(admin.id))

    return jsonify({
        "success": True,
        "message": "Login Successful",
        "token": access_token,
        "admin": {
            "id": admin.id,
            "full_name": admin.full_name,
            "email": admin.email
        }
    }), 200
    # ==========================
# Admin Profile API
# ==========================
@auth.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    admin_id = get_jwt_identity()

    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin not found"
        }), 404

    return jsonify({
        "success": True,
        "admin": {
            "id": admin.id,
            "full_name": admin.full_name,
            "email": admin.email
        }
    }), 200