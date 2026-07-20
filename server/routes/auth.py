import os
import re

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from config.extensions import db, bcrypt
from models.admin import Admin

auth = Blueprint("auth", __name__)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ==========================
# Register API
# ==========================
@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or {}

    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    invite_code = data.get("invite_code") or ""

    # -------- Invite Code Check --------
    # Only someone who has this secret code can create an admin account.
    # Set ADMIN_INVITE_CODE in your .env file.
    required_invite_code = os.getenv("ADMIN_INVITE_CODE")

    if not required_invite_code:
        return jsonify({
            "success": False,
            "message": "Registration is disabled. ADMIN_INVITE_CODE is not configured on the server."
        }), 403

    if invite_code != required_invite_code:
        return jsonify({
            "success": False,
            "message": "Invalid invite code"
        }), 403

    # -------- Field Validation --------
    if not full_name:
        return jsonify({
            "success": False,
            "message": "Full name is required"
        }), 400

    if not email or not EMAIL_REGEX.match(email):
        return jsonify({
            "success": False,
            "message": "A valid email is required"
        }), 400

    if not password or len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters long"
        }), 400

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

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

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