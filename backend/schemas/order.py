from pydantic import BaseModel, ConfigDict, model_validator
from typing import List, Optional, Any
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
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode='before')
    @classmethod
    def pull_product_fields(cls, data: Any):
        # When building from ORM, pull name/image from the related product
        if hasattr(data, 'product') and data.product:
            data.__dict__['product_name'] = data.product.name
            data.__dict__['product_image'] = data.product.image_url
        return data

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
