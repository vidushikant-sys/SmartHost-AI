from flask import Flask
from dotenv import load_dotenv
from flask_migrate import Migrate
from urllib.parse import quote_plus
from models.property import Property
from routes.property import property_bp
import os

from config.extensions import db, bcrypt, jwt, cors
from models.admin import Admin
from routes.auth import auth

# Load Environment Variables
load_dotenv()

app = Flask(__name__)

# ==========================
# Database Configuration
# ==========================
password = quote_plus(os.getenv("MYSQL_PASSWORD"))

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
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(property_bp, url_prefix="/api/property")

# ==========================
# Home Route
# ==========================
@app.route("/")
def home():
    return "✅ ViNova Backend is Running Successfully!"


if __name__ == "__main__":
    app.run(debug=True)