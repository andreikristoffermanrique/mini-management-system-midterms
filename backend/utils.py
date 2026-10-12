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
