from flask import Flask
from dotenv import load_dotenv
from config.db import db
from models.admin import Admin
from urllib.parse import quote_plus
from routes.auth import auth
import os

# Load .env file
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

# Initialize Database
db.init_app(app)

# Create tables automatically
with app.app_context():
    db.create_all()

app.register_blueprint(auth, url_prefix="/api/auth")
@app.route("/")
def home():
    return "✅ ViNova Backend is Running Successfully!"


if __name__ == "__main__":
    app.run(debug=True)