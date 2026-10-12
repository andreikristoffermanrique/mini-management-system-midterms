import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'mini_management.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    conn.commit()
    conn.close()
