from flask import Flask, jsonify, request
from pymongo import MongoClient
import random
import string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to access API

# MongoDB Connection
client = MongoClient("mongodb+srv://itsnishant470:rXjIlUsnqg8kjFbm@cluster0.amgic.mongodb.net/")
db = client["messageDB"]
collection = db["messages"]
id_collection = db["ids"]


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
    collection.insert_one({"msg": message, "gid": gid})

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

@app.route('/fetch-message/<gid>', methods=['GET'])
def fetch_message(gid):
    message_doc = collection.find_one({"gid": gid})

    if message_doc:
        message = message_doc['msg']
        collection.delete_one({"gid": gid})  # Delete after retrieval
        return jsonify({"message": message})
    
    return jsonify({"error": "Message not found or already viewed"}), 404


if __name__ == '__main__':
    app.run(debug=True)
