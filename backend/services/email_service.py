import os
import smtplib
from email.message import EmailMessage
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# You can configure these in your .env file
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_order_email(user_email: str, order_id: int, status: str, items_text: str = ""):
    """
    Sends an email to the user regarding their order status.
    Uses SMTP if configured, otherwise logs the email content to console.
    """
    subject = f"Furnish Order Update - #{order_id}"
    
    # Simple email body template
    body = f"""Hello,
    
Your order #{order_id} is currently: {status.upper()}

"""
    if items_text:
        body += f"Items in your order:\n{items_text}\n\n"
        
    body += "Thank you for shopping with Furnish!"

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USERNAME or "noreply@furni.com"
    msg["To"] = user_email
    
    # Check if SMTP configuration exists
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.warning(f"SMTP not fully configured. Email would have been sent to {user_email}\n--- EMAIL CONTENT ---\n{subject}\n\n{body}\n---------------------")
        return

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Successfully sent order update email to {user_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {user_email}: {e}")
