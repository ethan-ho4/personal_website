import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

def seed_database():
    load_dotenv()
    
    mongo_uri = os.environ.get("MONGO_URI")
    if not mongo_uri:
        print("Error: MONGO_URI not found in .env file.")
        print("Please add it and try again.")
        return

    content_file = "content.json"
    if not os.path.exists(content_file):
        print(f"Error: {content_file} not found. Ensure this script is run from the backend directory.")
        return

    try:
        with open(content_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading {content_file}: {e}")
        return

    print("Connecting to MongoDB Atlas...")
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        collection = client.get_database("portfolio").get_collection("content")
        
        print("Uploading data...")
        result = collection.update_one(
            {"_id": "main_content"},
            {"$set": data},
            upsert=True
        )
        
        if result.upserted_id:
            print("Successfully created new main_content document in MongoDB!")
        else:
            print("Successfully updated existing main_content document in MongoDB!")
            
    except Exception as e:
        print("Error connecting to or updating MongoDB:", e)

if __name__ == "__main__":
    seed_database()
