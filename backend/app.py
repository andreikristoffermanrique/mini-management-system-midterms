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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
