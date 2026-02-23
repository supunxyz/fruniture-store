from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price: float
    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    status: str = "pending"
    payment_method: Optional[str] = None
    address: Optional[str] = None
    mobile1: Optional[str] = None
    mobile2: Optional[str] = None

class OrderCreate(BaseModel):
    user_id: int
    items: List[OrderItemCreate]
    payment_method: str
    address: str
    mobile1: str
    mobile2: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[str] = None

class Order(OrderBase):
    id: int
    user_id: int
    total_amount: float
    created_at: datetime
    items: List[OrderItem] = []
    model_config = ConfigDict(from_attributes=True)
