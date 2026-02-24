from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services import product_service

router = APIRouter(
    prefix="/api/products",
    tags=["products"]
)

@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, product)

@router.get("/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return product_service.get_products(db, skip, limit)

@router.get("/best-selling", response_model=List[schemas.Product])
def get_best_selling_products(db: Session = Depends(get_db)):
    return product_service.get_best_selling_products(db)

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    return product_service.get_product(db, product_id)

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    return product_service.update_product(db, product_id, product_update)

@router.post("/{product_id}/images", response_model=schemas.Product)
def upload_product_images(product_id: int, files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    return product_service.upload_product_images(db, product_id, files)

@router.delete("/{product_id}/images/{image_id}", response_model=schemas.Product)
def delete_product_image(product_id: int, image_id: int, db: Session = Depends(get_db)):
    return product_service.delete_product_image(db, product_id, image_id)

@router.put("/{product_id}/images/{image_id}/set-primary", response_model=schemas.Product)
def set_primary_image(product_id: int, image_id: int, db: Session = Depends(get_db)):
    return product_service.set_primary_image(db, product_id, image_id)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product_service.delete_product(db, product_id)
    return {"message": "Product successfully deleted"}
