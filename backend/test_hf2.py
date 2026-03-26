import os
import PyPDF2
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

hf_api_key = os.environ.get("HUGGING_FACE_API_KEY").strip()
hf_model = os.environ.get("HUGGING_FACE_MODEL").strip()

client = InferenceClient(model=hf_model, token=hf_api_key)

reader = PyPDF2.PdfReader('resume.pdf')
resume_text = "\n".join(page.extract_text() for page in reader.pages)

prompt = f"""You are a JSON formatter.
Given the following resume text, return a JSON object containing the updated fields for 'contact', 'about', 'hero', 'skills', and 'timeline'. The data structure MUST EXACTLY match the following template. Reply ONLY with the raw JSON, no markdown formatting.

Template:
{{
  "contact": {{ "email": "", "location": "", "phone": "", "subtitle": "Have a project in mind? I'd love to hear about it.", "title": "Let's Work Together" }},
  "about": {{ "description1": "", "description2": "", "highlights": [ {{"description": "", "icon": "", "title": ""}} ], "stats": [ {{"label": "", "value": ""}} ], "title": "Who I Am" }},
  "hero": {{ "description": "", "subtitle": "", "title": "" }},
  "skills": {{ "categories": [ {{"category": "Frontend", "skills": [ {{"level": 90, "name": ""}} ] }} ], "subtitle": "A diverse skill set covering the full spectrum of modern web development", "title": "What I Do Best" }},
  "timeline": {{ "experiences": [ {{"achievements": [""], "color": "from-blue-500 to-cyan-500", "company": "", "description": "", "endMonth": "December", "endYear": "2024", "isCurrent": false, "period": "January 2022 - December 2024", "position": "", "startMonth": "January", "startYear": "2022", "year": 2022}} ], "subtitle": "Building the Future", "title": "Work Experience" }}
}}

Resume text:
{resume_text}
"""

print("Generating...")
response = client.chat_completion(
    messages=[
        {"role": "system", "content": "You only output JSON."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=4000,
    temperature=0.1
)

print(response.choices[0].message.content[:500])
