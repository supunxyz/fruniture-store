from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services import order_service

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"]
)

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return order_service.create_order(db, order)

@router.get("/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return order_service.get_orders(db, skip, limit)

@router.get("/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    return order_service.get_order(db, order_id)

@router.put("/{order_id}", response_model=schemas.Order)
def update_order(order_id: int, order_update: schemas.OrderUpdate, db: Session = Depends(get_db)):
    return order_service.update_order(db, order_id, order_update)

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order_service.delete_order(db, order_id)
    return {"message": "Order successfully deleted"}
