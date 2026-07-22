from config.extensions import db


class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # ---------------- Profile ----------------
    phone = db.Column(db.String(20), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)

    # ---------------- Appearance (synced from Settings > Appearance) ----------------
    theme_accent = db.Column(db.String(20), nullable=False, server_default="blue")
    theme_mode = db.Column(db.String(10), nullable=False, server_default="light")

    # ---------------- Notification preferences ----------------
    # Stored as a JSON string, e.g.
    # {"email_alerts": true, "fee_reminders": true, "complaint_updates": true, "notice_alerts": true}
    notification_prefs = db.Column(db.Text, nullable=True)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    # ---------------- Convert To Dictionary ----------------
    def to_dict(self):
        import json

        try:
            prefs = json.loads(self.notification_prefs) if self.notification_prefs else {}
        except (TypeError, ValueError):
            prefs = {}

        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "avatar_url": self.avatar_url,
            "theme_accent": self.theme_accent,
            "theme_mode": self.theme_mode,
            "notification_prefs": prefs,
            "created_at": str(self.created_at) if self.created_at else None,
            "updated_at": str(self.updated_at) if self.updated_at else None,
        }