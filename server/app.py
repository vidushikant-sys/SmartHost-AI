from flask import Flask
from dotenv import load_dotenv
from flask_migrate import Migrate
from urllib.parse import quote_plus


import os

from config.extensions import db, bcrypt, jwt, cors

# ==========================
# Models
# ==========================

from models.admin import Admin
from models.property import Property
from models.room_allocation import RoomAllocation
from models.fee import Fee
from models.fee_payment import FeePayment
from models.complaint import Complaint
from models.notice import Notice

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

# ==========================
# Load Environment Variables
# ==========================

load_dotenv()

app = Flask(__name__)

# ==========================
# Database Configuration
# ==========================

password = quote_plus(
    os.getenv("MYSQL_PASSWORD")
)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{password}"
    f"@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# ==========================
# Initialize Extensions
# ==========================

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)

migrate = Migrate(app, db)

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

# Fee Module
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

# ==========================
# Home Route
# ==========================

@app.route("/")
def home():
    return "✅ ViNova Backend is Running Successfully!"

# ==========================
# Run Server
# ==========================

if __name__ == "__main__":
    app.run(debug=True)