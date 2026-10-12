from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """Hashes a plaintext password."""
    return generate_password_hash(password)

def verify_password(password, hashed):
    """Verifies a plaintext password against a hash."""
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
