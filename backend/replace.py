import os

file_path = os.path.join(os.path.dirname(__file__), 'app.py')
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

target = "return a JSON object containing the updated fields for 'contact', 'about', 'home', 'skills', and 'timeline'. The data structure MUST EXACTLY match the following template."
replacement = "return a JSON object containing the updated fields for 'contact', 'about', 'home', 'skills', and 'timeline'.\nIMPORTANT: You MUST rewrite any descriptions, professional experiences, and achievements into the FIRST-PERSON perspective using 'I', 'my', 'me', as if you are the owner of the resume speaking directly to visitors on your personal portfolio website.\nThe data structure MUST EXACTLY match the following template."

if target in text:
    text = text.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced successfully")
else:
    print("Target not found")
