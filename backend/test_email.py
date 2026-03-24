import os
import smtplib
from dotenv import load_dotenv

load_dotenv()

smtp_email = os.environ.get("SMTP_EMAIL")
smtp_password = os.environ.get("SMTP_PASSWORD")
receiver_email = os.environ.get("RECEIVER_EMAIL")

print(f"SMTP_EMAIL: {smtp_email}")
print(f"RECEIVER_EMAIL: {receiver_email}")
print(f"SMTP_PASSWORD exists: {bool(smtp_password)}")

try:
    print("Testing connection to smtp.gmail.com...")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        print("Connected. Attempting login...")
        server.login(smtp_email, smtp_password)
        print("LOGIN SUCCESSFUL!")
except Exception as e:
    print(f"LOGIN FAILED. Error details:\n{e}")
