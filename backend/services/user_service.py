import os
import uuid
import shutil
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
import models
import schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Fake hash for simplicity
    fake_hashed_password = user.password + "notreallyhashed"
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=fake_hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login_user(db: Session, user_login: schemas.UserLogin):
    db_user = db.query(models.User).filter(models.User.email == user_login.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    fake_hashed_password = user_login.password + "notreallyhashed"
    if db_user.hashed_password != fake_hashed_password:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user_by_id(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return True

from services.storage_service import upload_file

def upload_profile_picture(db: Session, user_id: int, file: UploadFile):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Upload to S3 bucket or local fallback
    profile_url = upload_file(file, prefix=f"user_{user_id}")
    
    db_user.profile_picture = profile_url
    db.commit()
    db.refresh(db_user)
    
    return profile_url

def delete_profile_picture(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.profile_picture = None
    db.commit()
    db.refresh(db_user)
    return True
