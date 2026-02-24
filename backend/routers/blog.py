from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.blog import BlogPost as BlogPostModel
from schemas.blog import BlogPost, BlogPostCreate, BlogPostUpdate
from services.storage_service import upload_file

router = APIRouter(prefix="/api/blog", tags=["blog"])


@router.get("/", response_model=List[BlogPost])
def get_posts(published_only: bool = False, db: Session = Depends(get_db)):
    q = db.query(BlogPostModel)
    if published_only:
        q = q.filter(BlogPostModel.is_published == True)
    return q.order_by(BlogPostModel.created_at.desc()).all()


@router.get("/{post_id}", response_model=BlogPost)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPostModel).filter(BlogPostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", response_model=BlogPost)
def create_post(post: BlogPostCreate, db: Session = Depends(get_db)):
    db_post = BlogPostModel(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.put("/{post_id}", response_model=BlogPost)
def update_post(post_id: int, post: BlogPostUpdate, db: Session = Depends(get_db)):
    db_post = db.query(BlogPostModel).filter(BlogPostModel.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in post.dict(exclude_unset=True).items():
        setattr(db_post, key, value)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(BlogPostModel).filter(BlogPostModel.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted"}


@router.post("/{post_id}/image", response_model=BlogPost)
def upload_post_image(post_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_post = db.query(BlogPostModel).filter(BlogPostModel.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    image_url = upload_file(file, prefix="blog")
    db_post.image_url = image_url
    db.commit()
    db.refresh(db_post)
    return db_post
