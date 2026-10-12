from flask import Flask, jsonify
from flask_cors import CORS
from backend.database import init_db
from backend.routes import auth_bp, records_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key-for-midterms-2026!'
CORS(app)

with app.app_context():
    init_db()

app.register_blueprint(auth_bp)
app.register_blueprint(records_bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "success": True,
        "message": "Backend is running",
        "data": {}
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
