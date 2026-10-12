import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
try:
    from utils import hash_password, verify_password
    hashed = hash_password('TestPass123!')
    if verify_password('TestPass123!', hashed) and not verify_password('WrongPass', hashed):
        print("SEC-01 Check Passed: Hashing works.")
        sys.exit(0)
    else:
        print("SEC-01 Check Failed: Verification logic error.")
        sys.exit(1)
except ImportError as e:
    print(f"SEC-01 Check Failed: {e}")
    sys.exit(1)
