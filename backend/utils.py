from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import request

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed):
    return check_password_hash(hashed, password)

def success_response(message, data=None, status=200):
    response = {"success": True, "message": message}
    if data is not None:
        response["data"] = data
    return response, status

def error_response(message, errors=None, status=400):
    response = {"success": False, "message": message}
    if errors is not None:
        response["errors"] = errors
    return response, status

def validate_fields(required_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json(silent=True) or {}
            missing = [field for field in required_fields if field not in data]
            if missing:
                return error_response(f"Missing required fields: {', '.join(missing)}")
            return f(*args, **kwargs)
        return decorated_function
    return decorator

import jwt
from flask import current_app, g

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        if not token:
            return error_response("Token is missing", status=401)
        try:
            # Using a fallback dev secret if config isn't set yet
            secret = current_app.config.get("SECRET_KEY", "dev_secret")
            data = jwt.decode(token, secret, algorithms=["HS256"])
            g.current_user = data
        except Exception as e:
            return error_response("Token is invalid", status=401)
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = getattr(g, 'current_user', {})
        if user.get('role') != 'admin':
            return error_response("Admin access required", status=403)
        return f(*args, **kwargs)
    return decorated
