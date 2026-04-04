import os
import random
import time
import httpx
from fastapi import HTTPException

# In-memory OTP store: { phone_number: { "otp": "123456", "expires_at": timestamp } }
_otp_store = {}

TEXTLK_API_URL = "https://app.text.lk/api/v3/sms/send"
TEXTLK_API_TOKEN = os.getenv("TEXTLK_API_TOKEN", "")
TEXTLK_SENDER_ID = os.getenv("TEXTLK_SENDER_ID", "TextLKDemo")
OTP_EXPIRY_SECONDS = 300  # 5 minutes


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


def _normalize_phone(phone: str) -> str:
    """Strip '+' prefix so number is in format like 94771234567."""
    return phone.lstrip("+")


async def send_otp(phone_number: str) -> dict:
    if not phone_number:
        raise HTTPException(status_code=400, detail="Phone number is required")

    if not TEXTLK_API_TOKEN:
        raise HTTPException(status_code=500, detail="SMS API token not configured")

    otp = _generate_otp()
    recipient = _normalize_phone(phone_number)

    # Store OTP with expiry
    _otp_store[recipient] = {
        "otp": otp,
        "expires_at": time.time() + OTP_EXPIRY_SECONDS,
    }

    message = f"Your Furnish. verification code is: {otp}. Valid for 5 minutes."

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                TEXTLK_API_URL,
                headers={
                    "Authorization": f"Bearer {TEXTLK_API_TOKEN}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                json={
                    "recipient": recipient,
                    "sender_id": TEXTLK_SENDER_ID,
                    "type": "plain",
                    "message": message,
                },
            )
            data = response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to send SMS: {str(e)}")

    if data.get("status") is not True and data.get("status") != "success":
        raise HTTPException(
            status_code=502,
            detail=data.get("message", "SMS sending failed"),
        )

    return {"message": "OTP sent successfully", "phone": phone_number}


def verify_otp(phone_number: str, otp: str) -> bool:
    recipient = _normalize_phone(phone_number)
    record = _otp_store.get(recipient)

    if not record:
        raise HTTPException(status_code=400, detail="No OTP found for this number. Please request a new one.")

    if time.time() > record["expires_at"]:
        del _otp_store[recipient]
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    # OTP verified — remove from store
    del _otp_store[recipient]
    return True
