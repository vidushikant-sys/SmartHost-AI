from flask import Flask, request, send_from_directory
from dotenv import load_dotenv
from flask_migrate import Migrate
from urllib.parse import quote_plus
from datetime import timedelta, datetime

import os

# ==========================
# Extensions
# ==========================

from config.extensions import (
    db,
    bcrypt,
    jwt,
    cors
)
from config.swagger_config import init_swagger

# ==========================
# Utilities
# ==========================

from utils.error_handler import register_error_handlers
from utils.logger import logger

# ==========================
# Models
# ==========================

from models.admin import Admin
from models.property import Property
from models.room import Room
from models.student import Student
from models.room_allocation import RoomAllocation
from models.fee import Fee
from models.fee_payment import FeePayment
from models.complaint import Complaint
from models.notice import Notice
from models.notification import Notification
from models.activity_log import ActivityLog

# ==========================
# Routes
# ==========================

from routes.auth import auth
from routes.property import property_bp
from routes.room import room_bp
from routes.student import student_bp
from routes.room_allocation import allocation_bp
from routes.fee import fee_bp
from routes.complaint import complaint_bp
from routes.notice import notice_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp
from routes.search import search_bp
from routes.upload import upload_bp
from routes.notification import notification_bp
from routes.activity_log import activity_log_bp

# ==========================
# Load Environment Variables
# ==========================

load_dotenv()

# ==========================
# Create Flask App
# ==========================

app = Flask(__name__)

# ==========================
# Database Configuration
# ==========================

password = quote_plus(
    os.getenv("MYSQL_PASSWORD")
)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://"
    f"{os.getenv('MYSQL_USER')}:{password}"
    f"@{os.getenv('MYSQL_HOST')}/"
    f"{os.getenv('MYSQL_DB')}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ==========================
# Security Configuration
# ==========================

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=8
)

# ==========================
# Initialize Extensions
# ==========================

db.init_app(app)

bcrypt.init_app(app)

jwt.init_app(app)

cors.init_app(app)

migrate = Migrate(
    app,
    db
)
# ==========================
# Initialize Swagger
# ==========================

init_swagger(app)
# ==========================
# Register Blueprints
# ==========================

app.register_blueprint(
    auth,
    url_prefix="/api/auth"
)

app.register_blueprint(
    property_bp,
    url_prefix="/api/property"
)

app.register_blueprint(
    room_bp,
    url_prefix="/api/room"
)

app.register_blueprint(
    student_bp,
    url_prefix="/api/student"
)

app.register_blueprint(
    allocation_bp,
    url_prefix="/api/allocation"
)

app.register_blueprint(
    fee_bp
)

app.register_blueprint(
    complaint_bp,
    url_prefix="/api/complaint"
)

app.register_blueprint(
    notice_bp,
    url_prefix="/api/notice"
)

app.register_blueprint(
    dashboard_bp,
    url_prefix="/api/dashboard"
)

app.register_blueprint(
    reports_bp,
    url_prefix="/api/reports"
)

app.register_blueprint(
    search_bp,
    url_prefix="/api/search"
)

app.register_blueprint(
    upload_bp,
    url_prefix="/api/upload"
)

app.register_blueprint(
    notification_bp,
    url_prefix="/api/notification"
)
app.register_blueprint(

    activity_log_bp,

    url_prefix="/api/activity"

)
# ==========================
# Register Global Error Handlers
# ==========================

register_error_handlers(app)

# ==========================
# Application Startup Log
# ==========================

logger.info(
    "=============================================="
)

logger.info(
    "ViNova Hostel Management Backend Started"
)

logger.info(
    "=============================================="
)

# ==========================
# Request Logger
# ==========================

@app.before_request
def log_request():

    logger.info(
        f"{datetime.now()} | "
        f"{request.method} | "
        f"{request.path} | "
        f"IP: {request.remote_addr}"
    )

# ==========================
# Home Route
# ==========================

@app.route("/")
def home():

    return (
        "✅ ViNova Backend is Running Successfully!"
    )
# ==========================
# Serve Uploaded Images
# ==========================

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):

    return send_from_directory(
        "uploads",
        filename
    )

# ==========================
# Run Server
# ==========================

if __name__ == "__main__":

    logger.info(
        "Flask Development Server Started"
    )

    app.run(
        debug=True
    )