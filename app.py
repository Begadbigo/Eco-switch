from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import re  # For validation
import os

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Database Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "users.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = "your_secret_key"  # Change this for security

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    second_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    national_id = db.Column(db.String(20), unique=True, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# Ensure database tables are created
with app.app_context():
    db.create_all()

# ✅ **User Registration**
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Ensure all required fields are present
        required_fields = ['first_name', 'second_name', 'email', 'national_id', 'gender', 'age', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # National ID, Password, Age Validation
        if not re.match(r"^\d{14}$", data['national_id']):
            return jsonify({"error": "National ID must be exactly 14 digits."}), 400
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$", data['password']):
            return jsonify({"error": "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character."}), 400
        if not (12 <= int(data['age']) <= 100):
            return jsonify({"error": "Age must be between 12 and 100."}), 400

        # Ensure gender is either "Male" or "Female"
        if data['gender'] not in ["Male", "Female"]:
            return jsonify({"error": "Invalid gender selection."}), 400

        # Check if email or national ID already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already registered."}), 400
        if User.query.filter_by(national_id=data['national_id']).first():
            return jsonify({"error": "National ID already registered."}), 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        # Create new user
        new_user = User(
            first_name=data['first_name'],
            second_name=data['second_name'],
            email=data['email'],
            national_id=data['national_id'],
            gender=data['gender'],
            age=int(data['age']),
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        db.session.rollback()  # Ensure no partial inserts
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

# ✅ **User Login with JWT**
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if not user:
            return jsonify({"error": "Email not found"}), 404

        if not bcrypt.check_password_hash(user.password, data['password']):
            return jsonify({"error": "Incorrect password"}), 401

        # Generate JWT token
        access_token = create_access_token(identity=user.email)

        return jsonify({
            "message": "Login successful!",
            "token": access_token,
            "user": {
                "first_name": user.first_name,
                "second_name": user.second_name,
                "email": user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

# ✅ **Protected Route (Requires Token)**
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Welcome {current_user}, you have access!"}), 200

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
