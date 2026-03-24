import os
import json
import secrets
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage

load_dotenv()

app = Flask(__name__)

# Very simple session token storage in memory for demonstration purposes.
# In a real app, you would use a database or signed JWTs.
SESSION_TOKENS = set()

CONTENT_FILE = os.path.join(os.path.dirname(__file__), "content.json")

def load_content():
    if not os.path.exists(CONTENT_FILE):
        return {}
    try:
        with open(CONTENT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

def save_content(data):
    with open(CONTENT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    
    username = data.get("username")
    password = data.get("password")
    
    # Read from .env
    env_username = os.environ.get("ADMIN_USERNAME")
    env_password = os.environ.get("ADMIN_PASSWORD")
    
    if username == env_username and password == env_password:
        token = secrets.token_hex(16)
        SESSION_TOKENS.add(token)
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        if token in SESSION_TOKENS:
            return jsonify({"valid": True}), 200
    return jsonify({"valid": False}), 401

@app.route('/api/content', methods=['GET'])
def get_content():
    return jsonify(load_content()), 200

@app.route('/api/content', methods=['POST'])
def update_content():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    if token not in SESSION_TOKENS:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400
    
    save_content(data)
    return jsonify({"message": "Content updated successfully"}), 200

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.json
    if not data or not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({"error": "Missing required fields"}), 400
        
    name = data['name']
    sender_email = data['email']
    message = data['message']
    
    # Try to get SMTP settings
    smtp_email = os.environ.get("SMTP_EMAIL")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    
    if not smtp_email or not smtp_password:
        print("Warning: Contact form submitted but SMTP is not configured in .env")
        return jsonify({"error": "Email service not configured on the server"}), 500
        
    try:
        msg = EmailMessage()
        msg.set_content(f"Name: {name}\nEmail: {sender_email}\n\nMessage:\n{message}")
        msg['Subject'] = f"New Contact Request from {name}"
        msg['From'] = smtp_email
        
        # Send to RECEIVER_EMAIL if specified, otherwise send to the SMTP_EMAIL itself
        receiver_email = os.environ.get("RECEIVER_EMAIL", smtp_email)
        msg['To'] = receiver_email
        
        server_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        server_port = int(os.environ.get("SMTP_PORT", 465))
        
        if server_port == 465:
            with smtplib.SMTP_SSL(server_host, server_port) as server:
                server.login(smtp_email, smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(server_host, server_port) as server:
                server.starttls()
                server.login(smtp_email, smtp_password)
                server.send_message(msg)
                
        return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"error": "Failed to send email. Ensure SMTP credentials are correct."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
