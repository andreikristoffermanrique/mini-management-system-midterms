from flask import Blueprint
from backend.controllers import register_user, login_user, create_record, get_records

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_bp.route('/register', methods=['POST'], strict_slashes=False)(register_user)
auth_bp.route('/login', methods=['POST'], strict_slashes=False)(login_user)

records_bp = Blueprint('records', __name__, url_prefix='/api/records')
records_bp.route('', methods=['POST'], strict_slashes=False)(create_record)
records_bp.route('', methods=['GET'], strict_slashes=False)(get_records)
