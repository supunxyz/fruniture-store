import os
import shutil
import uuid
import boto3
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
S3_REGION = os.getenv("S3_REGION", "us-east-1")
S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_ACCESS_KEY")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL") # Useful for DigitalOcean Spaces or Cloudflare R2

s3_client = None
if S3_BUCKET_NAME and S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=S3_ACCESS_KEY_ID,
        aws_secret_access_key=S3_SECRET_ACCESS_KEY,
        region_name=S3_REGION,
        endpoint_url=S3_ENDPOINT_URL
    )

def upload_file(file: UploadFile, prefix: str = "") -> str:
    """
    Uploads a file directly to the configured S3 compatible bucket, 
    or saves it locally if no bucket credentials are found.
    """
    ext = file.filename.split('.')[-1]
    filename = f"{prefix}_{uuid.uuid4().hex}.{ext}"
    
    if s3_client:
        try:
            # Upload to S3 Bucket
            s3_client.upload_fileobj(
                file.file,
                S3_BUCKET_NAME,
                filename,
                ExtraArgs={"ContentType": file.content_type}
            )
            # Depending on if you use custom endpoints (like R2), the URL format can change
            if S3_ENDPOINT_URL:
                return f"{S3_ENDPOINT_URL}/{S3_BUCKET_NAME}/{filename}"
            return f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/{filename}"
        except Exception as e:
            print(f"Failed to upload to S3: {e}")
            raise e
    else:
        # Fallback to local storage
        os.makedirs("uploads", exist_ok=True)
        file_path = os.path.join("uploads", filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return f"http://127.0.0.1:8000/uploads/{filename}"
