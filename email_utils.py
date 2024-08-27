import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))  # Default to 587 if not set
SMTP_USER = os.getenv("SMTP_USER", "noreply@yourdomain.com")  # Provide a default value
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(to: str, subject: str, body: str):
    if not to or not subject or not body:
        raise ValueError("Missing email parameters")

    if not SMTP_SERVER or not SMTP_PORT or not SMTP_USER or not SMTP_PASSWORD:
        raise ValueError("Missing SMTP configuration. Please check your environment variables.")

    msg = MIMEMultipart()
    msg['From'] = formataddr(('Your App Name', SMTP_USER))
    msg['To'] = to
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Email sent to {to}")
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise