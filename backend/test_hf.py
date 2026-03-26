import os
from dotenv import load_dotenv
import requests
import json
import PyPDF2

load_dotenv()

hf_api_key = os.environ.get("HUGGING_FACE_API_KEY").strip()
hf_model = os.environ.get("HUGGING_FACE_MODEL").strip()

reader = PyPDF2.PdfReader('resume.pdf')
resume_text = "\n".join(page.extract_text() for page in reader.pages)

prompt = f"""You are an assistant that extracts resume text and updates a personal website's JSON content.
Given the following resume text, return a JSON object containing the updated fields for 'contact', 'about', 'hero', 'skills', and 'timeline'. The data structure MUST EXACTLY match the following template. Do not include 'projects'. Reply ONLY with the raw JSON, no markdown blocks, no formatting.

Template:
{{
  "contact": {{ "email": "", "location": "", "phone": "", "subtitle": "Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.", "title": "Let's Work Together" }},
  "about": {{ "description1": "", "description2": "", "highlights": [ {{"description": "", "icon": "", "title": ""}} ], "stats": [ {{"label": "", "value": ""}} ], "title": "Who I Am" }},
  "hero": {{ "description": "", "subtitle": "", "title": "" }},
  "skills": {{ "categories": [ {{"category": "Frontend", "skills": [ {{"level": 90, "name": ""}} ] }} ], "subtitle": "A diverse skill set covering the full spectrum of modern web development", "title": "What I Do Best" }},
  "timeline": {{ "experiences": [ {{"achievements": [""], "color": "from-blue-500 to-cyan-500", "company": "", "description": "", "endMonth": "December", "endYear": "2024", "isCurrent": false, "period": "January 2022 - December 2024", "position": "", "startMonth": "January", "startYear": "2022", "year": 2022}} ], "subtitle": "Building the Future", "title": "Work Experience" }}
}}

Resume text:
{resume_text}
"""

API_URL = f"https://api-inference.huggingface.co/models/{hf_model}/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {hf_api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": hf_model,
    "messages": [
        {"role": "system", "content": "You are a helpful assistant that only outputs JSON."},
        {"role": "user", "content": prompt}
    ],
    "max_tokens": 4000,
    "temperature": 0.1
}

print(f"Calling: {API_URL}")
response = requests.post(API_URL, headers=headers, json=payload)
print(response.status_code)
if response.status_code == 200:
    res = response.json()
    print("SUCCESS")
    print(res["choices"][0]["message"]["content"][:500])
else:
    print(response.text)
