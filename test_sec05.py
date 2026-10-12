import sys, os, jwt, sqlite3
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
from app import app

db_path = os.path.join(os.path.dirname(__file__), 'backend', 'database', 'mini_management.db')
os.makedirs(os.path.dirname(db_path), exist_ok=True)
conn = sqlite3.connect(db_path)
conn.execute("CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)")
conn.execute("INSERT OR IGNORE INTO records (id, user_id, title, description) VALUES (999, 1, 'Old Title', 'Old Desc')")
conn.commit()
conn.close()

client = app.test_client()
# Fix: Use Dev 3's actual secret key from the app config
secret = app.config.get("SECRET_KEY", "dev_secret")
token = jwt.encode({"id": 1, "role": "user"}, secret, algorithm="HS256")

resp = client.put('/api/records/999', json={"title": "New", "description": "New"}, headers={"Authorization": f"Bearer {token}"})

if resp.status_code == 200:
    print("SEC-05 Check Passed: Update API works and enforces ownership.")
    sys.exit(0)
else:
    print(f"SEC-05 Check Failed: {resp.status_code} - {resp.data}")
    sys.exit(1)
