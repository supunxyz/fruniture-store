from sqlalchemy.orm import Session
from fastapi import HTTPException
import models
import schemas

def create_order(db: Session, order: schemas.OrderCreate):
    user = db.query(models.User).filter(models.User.id == order.user_id).first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")

    total_amount = 0.0
    order_items = []
    
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        
        total_amount += product.price * item.quantity
        order_items.append(models.OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        ))
        
    db_order = models.Order(
        user_id=order.user_id,
        total_amount=total_amount,
        items=order_items,
        payment_method=order.payment_method,
        address=order.address,
        mobile1=order.mobile1,
        mobile2=order.mobile2
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

def update_order(db: Session, order_id: int, order_update: schemas.OrderUpdate):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value)
        
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(db_order)
    db.commit()
    return True
