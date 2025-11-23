# backend/app.py
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
from bson import ObjectId
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend

# ==================== MongoDB Atlas Connection ====================
uri = "mongodb+srv://mahaled553:EvPBvuh3aBX38mae@cluster0.fqdkcto.mongodb.net/?retryWrites=true&w=majority&tls=true"

client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())

try:
    client.admin.command('ping')
    print("MongoDB Atlas connected successfully!")
except Exception as e:
    print("MongoDB connection failed:", e)

db = client["school_records"]           # Your database name
collection = db["uploads"]               # Collection to store file metadata

# Create uploads folder if not exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==================== Upload Batch Route ====================
@app.route('/upload/batch', methods=['POST'])
def upload_batch():
    try:
        uploaded_count = 0
        i = 0

        while f"files[{i}][file]" in request.files:
            file = request.files[f"files[{i}][file]"]
            className = request.form.get(f"files[{i}][className]")
            date_str = request.form.get(f"files[{i}][date]")
            file_type = request.form.get(f"files[{i}][type]")

            if not file or not className or not date_str or not file_type:
                i += 1
                continue

            # Generate unique filename exactly like frontend expects
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_original_name = file.filename.replace(" ", "_")
            stored_filename = f"{timestamp}_{safe_original_name}"

            filepath = os.path.join(UPLOAD_FOLDER, stored_filename)
            file.save(filepath)

            # Save to MongoDB with correct stored_filename
            record = {
                "filename": file.filename,           # Original name (shown in UI)
                "stored_filename": stored_filename,  # Actual file on disk
                "className": className.strip(),
                "date": date_str,
                "type": file_type,
                "uploadedAt": datetime.utcnow(),
                "path": filepath
            }
            collection.insert_one(record)
            uploaded_count += 1
            i += 1

        return jsonify({
            "success": True,
            "message": f"Uploaded {uploaded_count} files successfully!"
        })

    except Exception as e:
        print("Upload error:", e)
        return jsonify({"error": str(e)}), 500

# ==================== Get All Records Route ====================
@app.route('/data/all', methods=['GET'])
def get_all_records():
    try:
        records = list(collection.find().sort("uploadedAt", -1))
        
        serialized = []
        for r in records:
            r['_id'] = str(r['_id'])
            r['uploadedAt'] = r['uploadedAt'].isoformat()
            serialized.append(r)
        
        return jsonify({
            "success": True,
            "data": serialized   # ← React expects this
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

 # ==================== SERVE FILE (FIXED) ====================
@app.route('/file/<filename>')
def serve_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=False)
    except FileNotFoundError:
        return jsonify({"error": "File not found on server"}), 404




# ==================== DELETE RECORD (FIXED) ====================
@app.route('/delete/<record_id>', methods=['DELETE'])
def delete_record(record_id):
    try:
        # Convert string ID to ObjectId
        result = collection.delete_one({"_id": ObjectId(record_id)})
        
        if result.deleted_count == 1:
            # Optional: Also delete the physical file
            record = collection.find_one({"_id": ObjectId(record_id)})
            if record and os.path.exists(record["path"]):
                os.remove(record["path"])
            
            return jsonify({"success": True, "message": "Record and file deleted"})
        
        return jsonify({"error": "Record not found"}), 404
    except Exception as e:
        print("Delete error:", e)
        return jsonify({"error": str(e)}), 500
    

# ==================== Optional: Health Check ====================
@app.route('/')
def home():
    return "Student Risk Dashboard Backend Running!"


if __name__ == '__main__':
    # Fix for Windows socket error
    app.run(debug=True, port=5000, use_reloader=False)





#uri = "mongodb+srv://mahaled553:EvPBvuh3aBX38mae@cluster0.fqdkcto.mongodb.net/?retryWrites=true&w=majority&tls=true"    