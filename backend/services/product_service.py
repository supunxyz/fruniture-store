import os
import shutil
import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from typing import List
import models
import schemas

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_best_selling_products(db: Session):
    products = db.query(models.Product).order_by(models.Product.rating.desc()).limit(4).all()
    
    if not products:
        dummy_products = [
            {"name": "Luxury Sofa", "price": 299.00, "original_price": 350.00, "rating": 5.0, "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80", "category": "Sofa", "stock": 10},
            {"name": "Premium Lamp", "price": 79.00, "original_price": 90.00, "rating": 4.8, "image_url": "https://images.unsplash.com/photo-1542728928-1413d1894ed1?w=500&q=80", "category": "Lamp", "stock": 50},
            {"name": "Accent Chair", "price": 199.00, "original_price": None, "rating": 4.9, "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80", "category": "Chair", "stock": 15},
            {"name": "Soft Pom Sofa", "price": 133.00, "original_price": 150.00, "rating": 4.6, "image_url": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80", "category": "Sofa", "stock": 20},
        ]
        for dp in dummy_products:
            new_prod = models.Product(**dp)
            db.add(new_prod)
        db.commit()
        products = db.query(models.Product).order_by(models.Product.rating.desc()).limit(4).all()
        
    return products

def get_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

from services.storage_service import upload_file

def upload_product_images(db: Session, product_id: int, files: List[UploadFile]):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for file in files:
        # Upload directly to S3 Bucket or local fallback
        image_url = upload_file(file, prefix=f"product_{product_id}")
        
        new_image = models.ProductImage(product_id=product_id, image_url=image_url)
        db.add(new_image)
        
        # Always update the primary image_url with the latest uploaded image
        db_product.image_url = image_url

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return True

def delete_product_image(db: Session, product_id: int, image_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_image = db.query(models.ProductImage).filter(
        models.ProductImage.id == image_id,
        models.ProductImage.product_id == product_id
    ).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(db_image)
    # If deleted image was the primary, update to next available
    if db_product.image_url == db_image.image_url:
        remaining = db.query(models.ProductImage).filter(
            models.ProductImage.product_id == product_id,
            models.ProductImage.id != image_id
        ).first()
        db_product.image_url = remaining.image_url if remaining else None
    db.commit()
    db.refresh(db_product)
    return db_product

def set_primary_image(db: Session, product_id: int, image_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_image = db.query(models.ProductImage).filter(
        models.ProductImage.id == image_id,
        models.ProductImage.product_id == product_id
    ).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    db_product.image_url = db_image.image_url
    db.commit()
    db.refresh(db_product)
    return db_product

