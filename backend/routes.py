from flask import Blueprint
from backend.controllers import register_user, login_user

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

auth_bp.route('/register', methods=['POST'])(register_user)
auth_bp.route('/login', methods=['POST'])(login_user)

# ---- EXTENDED CRUD (Developer 4) ----
from flask import request, g
from backend.database import get_db
from backend.utils import token_required, success_response, error_response

records_bp = Blueprint('records', __name__, url_prefix='/api/records')

@records_bp.route('/<int:record_id>', methods=['PUT'])
@token_required
def update_record(record_id):
    data = request.get_json(silent=True) or {}
    title = data.get('title')
    description = data.get('description')
    
    if not title or not description:
        return error_response("Title and description are required", status=400)
        
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM records WHERE id = ?", (record_id,))
    record = cursor.fetchone()
    
    if not record:
        return error_response("Record not found", status=404)
        
    # Enforce RBAC ownership
    if record['user_id'] != g.current_user['id'] and g.current_user.get('role') != 'admin':
        return error_response("Unauthorized", status=403)
        
    cursor.execute("UPDATE records SET title = ?, description = ? WHERE id = ?", (title, description, record_id))
    db.commit()
    return success_response("Record updated successfully")
# -------------------------------------
