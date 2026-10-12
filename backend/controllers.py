from flask import request, g
import jwt
import datetime
from backend.database import get_db

# ---- FALLBACK (Developer 3): owner's version wins on merge ----
try:
    from backend.utils import success_response, error_response
    from werkzeug.security import generate_password_hash, check_password_hash
    from backend.decorators import token_required
except ImportError:
    from werkzeug.security import generate_password_hash, check_password_hash
    from functools import wraps
    def success_response(message, data=None, status=200):
        return {"success": True, "message": message, "data": data or {}}, status
    def error_response(message, errors=None, status=400):
        return {"success": False, "message": message, "errors": errors or {}}, status
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return error_response("Token missing", status=401)
            try:
                token = auth_header.split(" ")[1]
                decoded = jwt.decode(token, "super-secret-key-for-midterms-2026!", algorithms=["HS256"])
                g.current_user = {"id": decoded['user_id'], "username": decoded['username'], "role": decoded['role']}
            except Exception as e:
                return error_response(f"Token invalid: {str(e)}", status=401)
            return f(*args, **kwargs)
        return decorated
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
        }, "super-secret-key-for-midterms-2026!", algorithm="HS256")
        return success_response("Login successful", {
            "token": token,
            "user": {"id": user['id'], "username": user['username'], "role": user['role']}
        })
    return error_response("Invalid credentials", status=401)

@token_required
def create_record():
    data = request.get_json()
    if not data or not data.get('title'):
        return error_response("Title is required", status=400)
    
    title = data['title']
    description = data.get('description', '')
    user_id = g.current_user['id']
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO records (title, description, user_id) VALUES (?, ?, ?)",
        (title, description, user_id)
    )
    db.commit()
    record_id = cursor.lastrowid
    
    record = db.execute("SELECT * FROM records WHERE id = ?", (record_id,)).fetchone()
    return success_response("Record created successfully", {"record": dict(record)}, status=201)

@token_required
def get_records():
    db = get_db()
    records = db.execute("SELECT * FROM records ORDER BY created_at DESC").fetchall()
    return success_response("Records fetched successfully", {"records": [dict(r) for r in records]})
