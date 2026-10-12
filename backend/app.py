from flask import Flask, jsonify
from flask_cors import CORS
from backend.database import init_db
from backend.routes import auth_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key'
CORS(app)

with app.app_context():
    init_db()

app.register_blueprint(auth_bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "success": True,
        "message": "Backend is running",
        "data": {}
    }), 200


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
