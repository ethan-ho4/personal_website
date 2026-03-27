import os
import json
import secrets
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import smtplib
import urllib.request
from email.message import EmailMessage
import PyPDF2
from huggingface_hub import InferenceClient

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

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    if token not in SESSION_TOKENS:
        return jsonify({"error": "Unauthorized"}), 401
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        try:
            reader = PyPDF2.PdfReader(file)
            resume_text = "\n".join(page.extract_text() for page in reader.pages)
        except Exception as e:
            return jsonify({"error": f"Failed to parse PDF: {str(e)}"}), 400
            
        hf_api_key = os.environ.get("HUGGING_FACE_API_KEY")
        hf_model = os.environ.get("HUGGING_FACE_MODEL")
        if not hf_api_key or not hf_model:
            return jsonify({"error": "Hugging Face API key or model not configured"}), 500
            
        hf_api_key = hf_api_key.strip()
        hf_model = hf_model.strip()

        try:
            client = InferenceClient(model=hf_model, token=hf_api_key)
            prompt = f"""You are a JSON formatter.
Given the following resume text, return a JSON object containing the updated fields for 'contact', 'about', 'home', 'skills', and 'timeline'. 
IMPORTANT: You MUST rewrite any descriptions, professional experiences, and achievements into the FIRST-PERSON perspective using 'I', 'me', and 'my', pretending you are the owner of the resume talking on their personal portfolio website.
The data structure MUST EXACTLY match the following template. Reply ONLY with the raw valid JSON, no markdown formatting blocks.

Template:
{{
  "contact": {{ "email": "", "location": "", "phone": "", "subtitle": "Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.", "title": "Let's Work Together" }},
  "about": {{ "description1": "", "description2": "", "highlights": [ {{"description": "", "icon": "", "title": ""}} ], "stats": [ {{"label": "", "value": ""}} ], "title": "Who I Am" }},
  "home": {{ "description": "", "subtitle": "", "title": "" }},
  "skills": {{ "categories": [ {{"category": "Frontend", "skills": [ {{"level": 90, "name": ""}} ] }} ], "subtitle": "A diverse skill set covering the full spectrum of modern web development", "title": "What I Do Best" }},
  "timeline": {{ "experiences": [ {{"achievements": [""], "color": "from-blue-500 to-cyan-500", "company": "", "description": "", "endMonth": "December", "endYear": "2024", "isCurrent": false, "period": "January 2022 - December 2024", "position": "", "startMonth": "January", "startYear": "2022", "year": 2022}} ], "subtitle": "Building the Future", "title": "Work Experience" }}
}}

Resume text:
{resume_text}
"""
            response = client.chat_completion(
                messages=[
                    {"role": "system", "content": "You only output JSON. Do not output anything other than JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=4000,
                temperature=0.1
            )
            
            generated_text = response.choices[0].message.content.strip()
            if generated_text.startswith("```json"):
                generated_text = generated_text[7:]
            if generated_text.endswith("```"):
                generated_text = generated_text[:-3]
            generated_text = generated_text.strip()
            
            new_data = json.loads(generated_text)
            
            current_content = load_content()
            for k in ["contact", "about", "home", "skills", "timeline"]:
                if k in new_data:
                    current_content[k] = new_data[k]
                    
            save_content(current_content)
            return jsonify({"message": "Resume parsed and website content updated successfully!", "data": current_content}), 200

        except json.JSONDecodeError as e:
            return jsonify({"error": f"Failed to map AI response to JSON: {str(e)}", "raw_output": generated_text}), 500
        except Exception as e:
            return jsonify({"error": f"Failed to call InferenceClient: {str(e)}"}), 500

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

@app.route('/api/fetch-github-projects', methods=['POST'])
def fetch_github_projects():
    data = request.json
    if not data or not data.get('githubUrl'):
        return jsonify({"error": "GitHub URL is required"}), 400
        
    url = data['githubUrl'].strip()
    username = url.rstrip('/').split('/')[-1]
    
    if not username:
        return jsonify({"error": "Invalid GitHub URL format"}), 400
        
    try:
        api_url = f"https://api.github.com/users/{username}/repos?sort=pushed&per_page=100"
        req = urllib.request.Request(api_url)
        req.add_header('User-Agent', 'Ethan-Ho-Portfolio-Fetcher')
        
        gh_token = os.environ.get("GITHUB_TOKEN")
        if gh_token:
            req.add_header('Authorization', f'token {gh_token}')
            
        with urllib.request.urlopen(req) as response:
            repos_data = json.loads(response.read().decode())
            
        projects_list = []
        for repo in repos_data:
            if repo.get("fork"): continue
            
            title = repo.get("name", "").replace("-", " ").replace("_", " ").title()
            
            tags = repo.get("topics", [])
            if not tags and repo.get("language"):
                tags = [repo.get("language")]
                
            desc = repo.get("description") or ""
            try:
                import re
                readme_url = f"https://raw.githubusercontent.com/{username}/{repo.get('name')}/{repo.get('default_branch', 'main')}/README.md"
                req_readme = urllib.request.Request(readme_url)
                if gh_token:
                    req_readme.add_header('Authorization', f'token {gh_token}')
                with urllib.request.urlopen(req_readme, timeout=3) as r_resp:
                    readme_text = r_resp.read().decode('utf-8')
                    clean_text = re.sub(r'\[.*?\]\(.*?\)', '', readme_text) 
                    clean_text = re.sub(r'<[^>]*>', '', clean_text) 
                    clean_text = re.sub(r'[#*`_!|>\n]', ' ', clean_text) 
                    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
                    if len(clean_text) > 20:
                        desc = (clean_text[:220] + "...") if len(clean_text) > 220 else clean_text
            except Exception:
                pass
                
            projects_list.append({
                "title": title,
                "description": desc,
                "image": f"https://opengraph.githubassets.com/1/{username}/{repo.get('name')}",
                "tags": tags,
                "github": repo.get("html_url", ""),
                "live": repo.get("homepage") or ""
            })
            
        return jsonify({"projects": projects_list}), 200
        
    except urllib.error.HTTPError as e:
        error_info = e.read().decode()
        print(f"GitHub API Error: {error_info}")
        return jsonify({"error": "Failed to fetch from GitHub API. Please check the URL or wait due to rate limiting."}), e.code
    except Exception as e:
        print(f"Error fetching GitHub projects: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
