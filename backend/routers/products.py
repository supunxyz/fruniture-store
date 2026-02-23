import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/api/products",
    tags=["products"]
)

@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

@router.get("/best-selling", response_model=List[schemas.Product])
def get_best_selling_products(db: Session = Depends(get_db)):
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

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

@router.post("/{product_id}/images", response_model=schemas.Product)
def upload_product_images(product_id: int, files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    os.makedirs("uploads", exist_ok=True)
    
    for file in files:
        file_ext = file.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"uploads/{file_name}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Store as relative path that can be served directly
        image_url = f"http://localhost:8000/uploads/{file_name}"
        
        # Add to product_images
        new_image = models.ProductImage(product_id=product_id, image_url=image_url)
        db.add(new_image)
        
        # Overwrite main product image if it's external or empty
        # or we just let frontend handle multiple images. 
        # But we also update the first image as main_image for backward compatibility
        if "unsplash" in db_product.image_url or not db_product.image_url or not db_product.images:
             db_product.image_url = image_url

    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product successfully deleted"}
