from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services import user_service

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user)

@router.post("/login", response_model=schemas.User)
def login_user(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    return user_service.login_user(db, user_login)

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_service.get_users(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    return user_service.get_user_by_id(db, user_id)

@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    return user_service.update_user(db, user_id, user_update)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_service.delete_user(db, user_id)
    return {"message": "User successfully deleted"}

@router.post("/{user_id}/upload-profile-picture")
def upload_profile_picture(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    profile_url = user_service.upload_profile_picture(db, user_id, file)
    return {"profile_picture": profile_url}

@router.delete("/{user_id}/profile-picture")
def delete_profile_picture(user_id: int, db: Session = Depends(get_db)):
    user_service.delete_profile_picture(db, user_id)
    return {"message": "Profile picture successfully deleted"}
