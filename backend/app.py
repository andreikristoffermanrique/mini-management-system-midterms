from flask import Flask, jsonify
from flask_cors import CORS
from backend.database import init_db

app = Flask(__name__)
CORS(app) # Allow frontend requests from localhost:5173

with app.app_context():
    init_db()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "success": True,
        "message": "Backend is running",
        "data": {}
    }), 200


# ---- ERROR HANDLERS (Developer 4) ----
from utils import error_response

@app.errorhandler(400)
def bad_request(e):
    return error_response(str(e.description) if e.description else "Bad Request", status=400)

@app.errorhandler(401)
def unauthorized(e):
    return error_response("Unauthorized", status=401)

@app.errorhandler(404)
def not_found(e):
    return error_response("Resource not found", status=404)

@app.errorhandler(500)
def internal_server_error(e):
    return error_response("Internal server error", status=500)
# --------------------------------------


# ---- LOGGING (Developer 4) ----
import logging
logging.basicConfig(level=logging.INFO)
from flask import request

@app.after_request
def log_request(response):
    app.logger.info(f"{request.method} {request.path} - {response.status_code}")
    return response
# -------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=5000)
