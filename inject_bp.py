import sys

with open('backend/app.py', 'r') as f:
    content = f.read()

if 'app.register_blueprint(records_bp)' not in content:
    reg_code = """
# ---- REGISTER EXTENDED APIs (Developer 4) ----
try:
    from backend.routes import records_bp
    app.register_blueprint(records_bp)
except ImportError:
    pass
# ----------------------------------------------
if __name__ == '__main__':"""
    content = content.replace("if __name__ == '__main__':", reg_code)
    with open('backend/app.py', 'w') as f:
        f.write(content)
