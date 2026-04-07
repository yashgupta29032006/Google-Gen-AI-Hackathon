import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing /health...")
    try:
        res = requests.get(f"{BASE_URL}/health")
        print(f"Status: {res.status_code}, Response: {res.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

def test_query():
    print("\nTesting /query (Multi-agent workflow)...")
    payload = {
        "text": "Add a task to buy milk and schedule a meeting with team at 5pm tomorrow",
        "user_id": "demo-user",
        "context": {"mode": "CHILL"}
    }
    try:
        start_time = time.time()
        res = requests.post(f"{BASE_URL}/query", json=payload)
        end_time = time.time()
        print(f"Status: {res.status_code}")
        print(f"Response Time: {end_time - start_time:.2f}s")
        if res.status_code == 200:
            print(json.dumps(res.json(), indent=2))
        else:
            print(f"Error: {res.text}")
    except Exception as e:
        print(f"Query failed: {e}")

def test_get_tasks():
    print("\nTesting /tasks (Persistence check)...")
    try:
        res = requests.get(f"{BASE_URL}/tasks?user_id=demo-user")
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            tasks = res.json()
            print(f"Found {len(tasks)} tasks.")
            for t in tasks:
                print(f"- {t['title']} ({t['priority']})")
    except Exception as e:
        print(f"Get tasks failed: {e}")

if __name__ == "__main__":
    test_health()
    test_query()
    test_get_tasks()
