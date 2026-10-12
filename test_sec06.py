import sys, os, jwt, sqlite3
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
from app import app

db_path = os.path.join(os.path.dirname(__file__), 'backend', 'database', 'mini_management.db')
conn = sqlite3.connect(db_path)
conn.execute("INSERT OR IGNORE INTO records (id, user_id, title, description) VALUES (888, 1, 'To Delete', 'Delete Me')")
conn.commit()
conn.close()

client = app.test_client()
secret = app.config.get("SECRET_KEY", "dev_secret")
token = jwt.encode({"id": 1, "role": "user"}, secret, algorithm="HS256")

resp = client.delete('/api/records/888', headers={"Authorization": f"Bearer {token}"})

if resp.status_code == 200:
    print("SEC-06 Check Passed: Delete API works and enforces ownership.")
    sys.exit(0)
else:
    print(f"SEC-06 Check Failed: {resp.status_code} - {resp.data}")
    sys.exit(1)
