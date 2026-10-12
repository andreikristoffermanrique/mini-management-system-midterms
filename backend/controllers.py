from flask import request
import jwt
import datetime
from backend.database import get_db

# ---- FALLBACK (Developer 3): owner's version wins on merge ----
try:
    from backend.utils import success_response, error_response
    from werkzeug.security import generate_password_hash, check_password_hash
except ImportError:
    from werkzeug.security import generate_password_hash, check_password_hash
    def success_response(message, data=None, status=200):
        return {"success": True, "message": message, "data": data or {}}, status
    def error_response(message, errors=None, status=400):
        return {"success": False, "message": message, "errors": errors or {}}, status
# ---------------------------------------------------------------

def register_user():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return error_response("Username and password required")
    
    username = data['username']
    password = generate_password_hash(data['password'])
    
    db = get_db()
    try:
        db.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        db.commit()
        return success_response("User registered successfully", status=201)
    except db.IntegrityError:
        return error_response("Username already exists", status=400)

def login_user():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return error_response("Username and password required")

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (data['username'],)).fetchone()
    
    if user and check_password_hash(user['password'], data['password']):
        token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'role': user['role'],
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
        }, "super-secret-key", algorithm="HS256")
        
        return success_response("Login successful", {
            "token": token,
            "user": {"id": user['id'], "username": user['username'], "role": user['role']}
        })
    
    return error_response("Invalid credentials", status=401)
