from flask import Flask, jsonify, request
from pymongo import MongoClient
import random
import string
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = Flask(__name__)
CORS(app)  # Allow frontend to access API

# MongoDB Connection
client = MongoClient("mongodb+srv://itsnishant470:rXjIlUsnqg8kjFbm@cluster0.amgic.mongodb.net/")
db = client["messageDB"]
collection = db["messages"]
id_collection = db["ids"]
msg_collection = db["msg"]
dlt_collection = db["dlt"]

# Generate Unique ID
def generate_gid():
    gid = str(random.randint(1000, 9999))
    random_str = ''.join(random.choices(string.ascii_letters, k=6))
    return gid + random_str

@app.route('/get-message', methods=['POST'])
def store_message():
    data = request.json
    message = data.get("message")

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    gid = generate_gid()
    collection.insert_one({"msg": message, "gid": gid, "timestamp": datetime.utcnow()})

    return jsonify({"gid": gid})

@app.route('/id', methods=['POST'])
def id():
    data = request.json
    id = data.get("id")

    if not id:
        return jsonify({"error": "id cannot be empty"}), 400
    gid = generate_gid()
    id_collection.insert_one({"name": id, "id": gid})

    return jsonify({"name": id, "id": gid })

def delete_old_messages():
    # Ensure UTC format
    print(f"Current UTC Time: {datetime.utcnow()}")  
    time_limit = datetime.utcnow().replace(tzinfo=timezone.utc) - timedelta(hours=24)
    print("All messages before", time_limit, "will be deleted")
    
    # Deleting messages older than 24 hours
    result = msg_collection.delete_many({"timestamp": {"$lt": time_limit}})
    resultfordelet = dlt_collection.delete_many({"timestamp": {"$lt": time_limit}})
    print(f"Deleted {result.deleted_count} messages older than 24 hours.")
    print(f"Deleted {resultfordelet.deleted_count} messages older than 24 hours.")

# Start the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(delete_old_messages, "interval", minutes=1)  # Runs every 1 minute
scheduler.start()

@app.route('/m', methods=['POST'])
def m():
    data = request.json
    m = data.get("m")
    gid = generate_gid()
    if not m:
        return jsonify({"error": "m cannot be empty"}), 400
    timestamp = datetime.utcnow()
    msg_collection.insert_one({"msg": m, "id": gid, "timestamp": timestamp})

    return jsonify({"msg": m, "id": gid, "timestamp": timestamp.isoformat()})

@app.route('/w', methods=['POST'])
def w():
    data = request.json
    user_id = data.get("d")

    all_messages = list(msg_collection.find({}, {"_id": 0, "id": 1, "msg": 1, "timestamp": 1}))

    seen_messages = list(dlt_collection.find({"d": user_id}, {"_id": 0, "msg": 1}))
    seen_msg_ids = {msg["msg"] for msg in seen_messages}

    new_messages = [
        {
            "id": msg["id"],
            "msg": msg["msg"],
            "timestamp": msg["timestamp"].isoformat(),  
            "delete_at": (msg["timestamp"] + timedelta(hours=24)).isoformat() 
        }
        for msg in all_messages if msg["id"] not in seen_msg_ids
    ]

    for msg in new_messages:
        dlt_collection.insert_one({"d": user_id, "msg": msg["id"], "timestamp": datetime.utcnow()})

    return jsonify({"data": new_messages})


@app.route('/d', methods=['POST'])
def d():
    data = request.json
    user_id = data.get("d")  
    msg_id = data.get("m")   

    if not user_id or not msg_id:
        return jsonify({"error": "User ID and Message ID cannot be empty"}), 400

    # Mark message as seen only if it’s not already recorded
    existing_entry = dlt_collection.find_one({"d": user_id, "msg": msg_id})
    if not existing_entry:
        dlt_collection.insert_one({"d": user_id, "msg": msg_id})

    return jsonify({"message": "Message marked as seen."})


@app.route('/fetch-message/<gid>', methods=['GET'])
def fetch_message(gid):
    message_doc = collection.find_one({"gid": gid})

    if message_doc:
        message = message_doc['msg']
        collection.delete_one({"gid": gid})  # Delete after retrieval
        return jsonify({"message": message})
    
    return jsonify({"error": "Message not found or already viewed"}), 404


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8000)
