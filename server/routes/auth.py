import os
import re
import json

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from config.extensions import db, bcrypt
from models.admin import Admin
from services.activity_log_service import create_activity_log

auth = Blueprint("auth", __name__)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

DEFAULT_NOTIFICATION_PREFS = {
    "email_alerts": True,
    "fee_reminders": True,
    "complaint_updates": True,
    "notice_alerts": True,
}


def _log_activity(admin_id, module, action, description):
    """Best-effort activity log write. Never blocks the main response."""
    try:
        create_activity_log({
            "admin_id": admin_id,
            "module": module,
            "action": action,
            "description": description,
            "ip_address": request.remote_addr,
        })
    except Exception:
        pass


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

    _log_activity(admin.id, "Authentication", "Login", f"{admin.email} logged in")

    return jsonify({
        "success": True,
        "message": "Login Successful",
        "token": access_token,
        "admin": admin.to_dict()
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
        "admin": admin.to_dict()
    }), 200


# ==========================
# Update Profile API
# ==========================
@auth.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():

    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin not found"
        }), 404

    data = request.get_json(silent=True) or {}

    full_name = (data.get("full_name") or "").strip()
    phone = (data.get("phone") or "").strip()
    avatar_url = data.get("avatar_url")

    if full_name:
        if len(full_name) < 2:
            return jsonify({
                "success": False,
                "message": "Full name must be at least 2 characters"
            }), 400
        admin.full_name = full_name

    if "phone" in data:
        if phone and not re.match(r"^[0-9+\-\s]{7,20}$", phone):
            return jsonify({
                "success": False,
                "message": "Enter a valid phone number"
            }), 400
        admin.phone = phone or None

    if avatar_url is not None:
        admin.avatar_url = avatar_url or None

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Failed to update profile"
        }), 500

    _log_activity(admin.id, "Authentication", "Update", "Profile details updated")

    return jsonify({
        "success": True,
        "message": "Profile updated successfully",
        "admin": admin.to_dict()
    }), 200


# ==========================
# Change Password API
# ==========================
@auth.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():

    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin not found"
        }), 404

    data = request.get_json(silent=True) or {}

    current_password = data.get("current_password") or ""
    new_password = data.get("new_password") or ""

    if not current_password or not new_password:
        return jsonify({
            "success": False,
            "message": "Current and new password are required"
        }), 400

    if not bcrypt.check_password_hash(admin.password, current_password):
        return jsonify({
            "success": False,
            "message": "Current password is incorrect"
        }), 401

    if len(new_password) < 6:
        return jsonify({
            "success": False,
            "message": "New password must be at least 6 characters long"
        }), 400

    if bcrypt.check_password_hash(admin.password, new_password):
        return jsonify({
            "success": False,
            "message": "New password must be different from the current password"
        }), 400

    admin.password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Failed to update password"
        }), 500

    _log_activity(admin.id, "Authentication", "Update", "Password changed")

    return jsonify({
        "success": True,
        "message": "Password changed successfully"
    }), 200


# ==========================
# Get Preferences API (Appearance + Notifications)
# ==========================
@auth.route("/preferences", methods=["GET"])
@jwt_required()
def get_preferences():

    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin not found"
        }), 404

    try:
        prefs = json.loads(admin.notification_prefs) if admin.notification_prefs else {}
    except (TypeError, ValueError):
        prefs = {}

    merged_prefs = {**DEFAULT_NOTIFICATION_PREFS, **prefs}

    return jsonify({
        "success": True,
        "preferences": {
            "theme_accent": admin.theme_accent or "blue",
            "theme_mode": admin.theme_mode or "light",
            "notification_prefs": merged_prefs
        }
    }), 200


# ==========================
# Update Preferences API (Appearance + Notifications)
# ==========================
@auth.route("/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():

    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin not found"
        }), 404

    data = request.get_json(silent=True) or {}

    valid_accents = ["blue", "green", "black", "purple", "red", "orange"]
    valid_modes = ["light", "dark"]

    if "theme_accent" in data:
        accent = data.get("theme_accent")
        if accent not in valid_accents:
            return jsonify({
                "success": False,
                "message": f"theme_accent must be one of: {', '.join(valid_accents)}"
            }), 400
        admin.theme_accent = accent

    if "theme_mode" in data:
        mode = data.get("theme_mode")
        if mode not in valid_modes:
            return jsonify({
                "success": False,
                "message": f"theme_mode must be one of: {', '.join(valid_modes)}"
            }), 400
        admin.theme_mode = mode

    if "notification_prefs" in data and isinstance(data.get("notification_prefs"), dict):
        try:
            existing = json.loads(admin.notification_prefs) if admin.notification_prefs else {}
        except (TypeError, ValueError):
            existing = {}
        merged = {**DEFAULT_NOTIFICATION_PREFS, **existing, **data["notification_prefs"]}
        admin.notification_prefs = json.dumps(merged)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Failed to update preferences"
        }), 500

    _log_activity(admin.id, "Authentication", "Update", "Preferences updated")

    try:
        prefs = json.loads(admin.notification_prefs) if admin.notification_prefs else {}
    except (TypeError, ValueError):
        prefs = {}

    return jsonify({
        "success": True,
        "message": "Preferences updated successfully",
        "preferences": {
            "theme_accent": admin.theme_accent or "blue",
            "theme_mode": admin.theme_mode or "light",
            "notification_prefs": {**DEFAULT_NOTIFICATION_PREFS, **prefs}
        }
    }), 200